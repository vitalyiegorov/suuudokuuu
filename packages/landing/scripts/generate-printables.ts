import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { isDefined } from '@rnw-community/shared';

import { DIFFICULTY_LADDER, DIFFICULTY_NAMES } from '../src/difficulty/constants/difficulty-name.constant';
import {
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE,
    PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE,
    PRINTABLE_LARGE_PRINT_SOLUTIONS_PER_PAGE
} from '../src/printable/constants/printable-layout.constant';
import {
    PRINTABLE_BLANK_GRID_PAGE_COUNT,
    PRINTABLE_BOOKLET_PAGE_COUNT,
    PRINTABLE_LARGE_PRINT_PAGE_COUNT
} from '../src/printable/constants/printable-page-count.constant';
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_LARGE_PRINT_PUZZLES } from '../src/printable/constants/printable-sample.constant';
import { SITE_NAME, SITE_ORIGIN } from '../src/seo/constants/site.constant';
import { EMPTY_PUZZLE_ENTRY } from '../src/solver/constants/puzzle-entry.constant';

import { createPublicDirectory } from './utils/create-public-directory.util';
import { handleGeneratorError } from './utils/handle-generator-error.util';
import { writePublicArtifact } from './utils/write-public-artifact.util';

import type { LandingDifficultyType } from '../src/difficulty/types/landing-difficulty.type';
import type { PDFFont, PDFPage } from 'pdf-lib';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const PAGE_MARGIN = 54;
const HEADER_HEIGHT = 46;
const FOOTER_HEIGHT = 26;
const GRID_GAP = 22;
const LABEL_HEIGHT = 16;
const LABEL_GAP = 5;
const GRID_LENGTH = 9;
const BOX_LENGTH = 3;
const THIN_LINE = 0.6;
const THICK_LINE = 1.6;
const DIGIT_FONT_SCALE = 0.5;
const DIGIT_VERTICAL_ADJUST = 0.32;
const BLANK_CHARACTER = '.';
const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.45, 0.45, 0.45);
const TITLE_FONT_SIZE = 26;
const SUBTITLE_FONT_SIZE = 13;
const HEADER_FONT_SIZE = 15;
const LABEL_FONT_SIZE = 10;
const FOOTER_FONT_SIZE = 9;
const COVER_LINE_GAP = 22;
const COVER_LINE_START_OFFSET = 150;

const CONTENT_LEFT = PAGE_MARGIN;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const CONTENT_TOP = PAGE_HEIGHT - PAGE_MARGIN - HEADER_HEIGHT;
const CONTENT_BOTTOM = PAGE_MARGIN + FOOTER_HEIGHT;
const CONTENT_HEIGHT = CONTENT_TOP - CONTENT_BOTTOM;

const OUTPUT_DIRECTORY = createPublicDirectory('printable');

interface FontsInterface {
    regular: PDFFont;
    bold: PDFFont;
}

interface GridPlacementInterface {
    x: number;
    gridTopY: number;
    labelY: number;
}

interface GridArrangementInterface {
    columns: number;
    rows: number;
}

interface BookletInterface {
    name: string;
    puzzleCountLine: string;
    puzzles: string[];
    pageCount: number;
    puzzlesPerPage: number;
    solutionsPerPage: number;
}

const GRID_ARRANGEMENTS = new Map<number, GridArrangementInterface>([
    [1, { columns: 1, rows: 1 }],
    [2, { columns: 1, rows: 2 }],
    [4, { columns: 2, rows: 2 }]
]);

const toSolutionDigits = (givens: string): string =>
    Sudoku.fromString(givens, defaultSudokuConfig)
        .FullField.flatMap(row => row.map(cell => String(cell.value)))
        .join('');

const drawCenteredText = (page: PDFPage, font: PDFFont, text: string, y: number, size: number, color = BLACK): void => {
    const width = font.widthOfTextAtSize(text, size);

    page.drawText(text, { x: (PAGE_WIDTH - width) / 2, y, size, font, color });
};

const drawPageChrome = (page: PDFPage, fonts: FontsInterface, headerText: string): void => {
    drawCenteredText(page, fonts.bold, headerText, PAGE_HEIGHT - PAGE_MARGIN - HEADER_FONT_SIZE, HEADER_FONT_SIZE);
    drawCenteredText(page, fonts.regular, `${SITE_NAME} — ${SITE_ORIGIN}`, PAGE_MARGIN - FOOTER_FONT_SIZE, FOOTER_FONT_SIZE, GRAY);
};

const getGridArrangement = (puzzlesPerPage: number): GridArrangementInterface => {
    const arrangement = GRID_ARRANGEMENTS.get(puzzlesPerPage);

    if (!isDefined(arrangement)) {
        throw new Error(`Unsupported printable layout of ${puzzlesPerPage} grids per page`);
    }

    return arrangement;
};

const computeGridPlacements = (columns: number, rows: number): { gridSize: number; placements: GridPlacementInterface[] } => {
    const blockWidth = (CONTENT_WIDTH - (columns - 1) * GRID_GAP) / columns;
    const blockHeight = (CONTENT_HEIGHT - (rows - 1) * GRID_GAP) / rows;
    const gridSize = Math.min(blockWidth, blockHeight - LABEL_HEIGHT);
    const blockActualHeight = gridSize + LABEL_HEIGHT;
    const totalHeight = rows * blockActualHeight + (rows - 1) * GRID_GAP;
    const startTopY = CONTENT_TOP - (CONTENT_HEIGHT - totalHeight) / 2;

    const placements: GridPlacementInterface[] = [];

    for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
            const blockX = CONTENT_LEFT + column * (blockWidth + GRID_GAP);
            const blockTopY = startTopY - row * (blockActualHeight + GRID_GAP);
            const gridTopY = blockTopY - LABEL_HEIGHT;

            placements.push({ x: blockX + (blockWidth - gridSize) / 2, gridTopY, labelY: blockTopY - LABEL_GAP });
        }
    }

    return { gridSize, placements };
};

const drawGridLines = (page: PDFPage, x: number, gridTopY: number, size: number): void => {
    for (let index = 0; index <= GRID_LENGTH; index += 1) {
        const thickness = index % BOX_LENGTH === 0 ? THICK_LINE : THIN_LINE;
        const offset = (index * size) / GRID_LENGTH;

        page.drawLine({ start: { x: x + offset, y: gridTopY - size }, end: { x: x + offset, y: gridTopY }, thickness, color: BLACK });
        page.drawLine({ start: { x, y: gridTopY - offset }, end: { x: x + size, y: gridTopY - offset }, thickness, color: BLACK });
    }
};

const drawGridDigits = (page: PDFPage, font: PDFFont, x: number, gridTopY: number, size: number, digits: string): void => {
    const cell = size / GRID_LENGTH;
    const fontSize = cell * DIGIT_FONT_SCALE;

    Array.from(digits).forEach((character, index) => {
        if (character === BLANK_CHARACTER) {
            return;
        }

        const column = index % GRID_LENGTH;
        const row = Math.floor(index / GRID_LENGTH);
        const textWidth = font.widthOfTextAtSize(character, fontSize);
        const cellLeftX = x + column * cell;
        const cellTopY = gridTopY - row * cell;

        page.drawText(character, {
            x: cellLeftX + (cell - textWidth) / 2,
            y: cellTopY - cell / 2 - fontSize * DIGIT_VERTICAL_ADJUST,
            size: fontSize,
            font,
            color: BLACK
        });
    });
};

const drawCenteredLabel = (page: PDFPage, font: PDFFont, text: string, placement: GridPlacementInterface, gridSize: number): void => {
    const width = font.widthOfTextAtSize(text, LABEL_FONT_SIZE);

    page.drawText(text, { x: placement.x + (gridSize - width) / 2, y: placement.labelY, size: LABEL_FONT_SIZE, font, color: GRAY });
};

const addGridPages = (
    doc: PDFDocument,
    fonts: FontsInterface,
    headerText: string,
    labelPrefix: string,
    items: string[],
    perPage: number
): void => {
    const { columns, rows } = getGridArrangement(perPage);
    const { gridSize, placements } = computeGridPlacements(columns, rows);

    for (let pageStart = 0; pageStart < items.length; pageStart += perPage) {
        const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

        drawPageChrome(page, fonts, headerText);

        items.slice(pageStart, pageStart + perPage).forEach((digits, offset) => {
            const placement = placements[offset];

            drawGridLines(page, placement.x, placement.gridTopY, gridSize);
            drawGridDigits(page, fonts.regular, placement.x, placement.gridTopY, gridSize, digits);
            drawCenteredLabel(page, fonts.bold, `${labelPrefix} ${pageStart + offset + 1}`, placement, gridSize);
        });
    }
};

const addCoverPage = (doc: PDFDocument, fonts: FontsInterface, title: string, lines: string[]): void => {
    const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    drawCenteredText(page, fonts.bold, title, PAGE_HEIGHT - COVER_LINE_START_OFFSET, TITLE_FONT_SIZE);

    lines.forEach((line, index) => {
        drawCenteredText(
            page,
            fonts.regular,
            line,
            PAGE_HEIGHT - COVER_LINE_START_OFFSET - TITLE_FONT_SIZE - (index + 1) * COVER_LINE_GAP,
            SUBTITLE_FONT_SIZE,
            GRAY
        );
    });
};

const embedFonts = async (doc: PDFDocument): Promise<FontsInterface> => ({
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold)
});

const buildBookletDocument = async (booklet: BookletInterface): Promise<PDFDocument> => {
    const solutions = booklet.puzzles.map(toSolutionDigits);
    const doc = await PDFDocument.create();
    const fonts = await embedFonts(doc);

    doc.setTitle(`${booklet.name} — Printable Puzzle Booklet`);
    doc.setAuthor(SITE_NAME);

    addCoverPage(doc, fonts, booklet.name, [
        booklet.puzzleCountLine,
        `${booklet.pageCount}-page PDF, US Letter, ${booklet.puzzlesPerPage} puzzles per page`,
        `Play more at ${SITE_ORIGIN}`
    ]);
    addGridPages(doc, fonts, `${booklet.name} — Puzzles`, 'Puzzle', booklet.puzzles, booklet.puzzlesPerPage);
    addGridPages(doc, fonts, `${booklet.name} — Solutions`, 'Solution', solutions, booklet.solutionsPerPage);

    return doc;
};

const buildTierBooklet = (difficulty: LandingDifficultyType): BookletInterface => {
    const puzzles = PRINTABLE_BOOKLET_PUZZLES[difficulty];

    return {
        name: `${DIFFICULTY_NAMES[difficulty]} Sudoku`,
        puzzleCountLine: `${puzzles.length} free printable puzzles with solutions`,
        puzzles,
        pageCount: PRINTABLE_BOOKLET_PAGE_COUNT,
        puzzlesPerPage: PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
        solutionsPerPage: PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
    };
};

const LARGE_PRINT_BOOKLET: BookletInterface = {
    name: 'Large Print Sudoku',
    puzzleCountLine: `${PRINTABLE_LARGE_PRINT_PUZZLES.length} free large-print puzzles with solutions`,
    puzzles: PRINTABLE_LARGE_PRINT_PUZZLES,
    pageCount: PRINTABLE_LARGE_PRINT_PAGE_COUNT,
    puzzlesPerPage: PRINTABLE_LARGE_PRINT_PUZZLES_PER_PAGE,
    solutionsPerPage: PRINTABLE_LARGE_PRINT_SOLUTIONS_PER_PAGE
};

const buildBlankGridDocument = async (): Promise<PDFDocument> => {
    const doc = await PDFDocument.create();
    const fonts = await embedFonts(doc);

    doc.setTitle('Blank Sudoku Grid — Printable Practice Sheets');
    doc.setAuthor(SITE_NAME);

    addCoverPage(doc, fonts, 'Blank Sudoku Grid', [
        'One full-page grid plus four practice grids',
        `${PRINTABLE_BLANK_GRID_PAGE_COUNT}-page PDF, US Letter`,
        `Play a finished puzzle at ${SITE_ORIGIN}`
    ]);
    addGridPages(doc, fonts, 'Blank Sudoku Grid — Full Page', 'Grid', [EMPTY_PUZZLE_ENTRY], 1);
    addGridPages(
        doc,
        fonts,
        'Blank Sudoku Grid — Practice Sheets',
        'Grid',
        [EMPTY_PUZZLE_ENTRY, EMPTY_PUZZLE_ENTRY, EMPTY_PUZZLE_ENTRY, EMPTY_PUZZLE_ENTRY],
        4
    );

    return doc;
};

const writePdf = async (fileName: string, doc: PDFDocument): Promise<void> => {
    const bytes = await doc.save();

    writePublicArtifact(OUTPUT_DIRECTORY, fileName, bytes);
};

const generate = async (): Promise<void> => {
    for (const difficulty of DIFFICULTY_LADDER) {
        await writePdf(`${DIFFICULTY_NAMES[difficulty].toLowerCase()}.pdf`, await buildBookletDocument(buildTierBooklet(difficulty)));
    }

    await writePdf('large-print.pdf', await buildBookletDocument(LARGE_PRINT_BOOKLET));
    await writePdf('blank-grid.pdf', await buildBlankGridDocument());

    console.log(`Generated ${DIFFICULTY_LADDER.length + 2} printable PDFs in ${OUTPUT_DIRECTORY}`);
};

generate().catch(handleGeneratorError);
