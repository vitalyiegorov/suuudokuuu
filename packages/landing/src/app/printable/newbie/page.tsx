import { DifficultyEnum } from '@suuudokuuu/generator';
import Link from 'next/link';

import { DifficultyNavigation } from '../../../difficulty/components/difficulty-navigation/difficulty-navigation';
import { getDifficultyClueCount } from '../../../difficulty/utils/get-difficulty-clue-count.util';
import { PrintableDownloadCard } from '../../../printable/components/printable-download-card/printable-download-card';
import {
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
} from '../../../printable/constants/printable-layout.constant';
import { PRINTABLE_BOOKLET_PUZZLES, PRINTABLE_BOOKLET_SIZE } from '../../../printable/constants/printable-sample.constant';
import { getPrintableBookletPageCount } from '../../../printable/utils/get-printable-booklet-page-count.util';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { sudokuDifficultyRatingPageMetadata } from '../../guides/sudoku-difficulty-rating/metadata';
import { homePageMetadata } from '../../metadata';
import { newbieSudokuPageMetadata } from '../../sudoku/newbie/metadata';
import { techniquesPageMetadata } from '../../techniques/metadata';
import { printableEasySudokuPageMetadata } from '../easy/metadata';
import { printableSudokuPageMetadata } from '../metadata';

import { printableNewbieSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableNewbieSudokuPageMetadata);

const PAGE_COUNT = getPrintableBookletPageCount(
    PRINTABLE_BOOKLET_SIZE,
    PRINTABLE_BOOKLET_PUZZLES_PER_PAGE,
    PRINTABLE_BOOKLET_SOLUTIONS_PER_PAGE
);
const [PREVIEW_PUZZLE] = PRINTABLE_BOOKLET_PUZZLES[DifficultyEnum.Newbie];

const PrintableNewbieSudokuPage = () => (
    <main>
        <ArticleSchema
            dateModified={printableNewbieSudokuPageMetadata.updatedAt}
            datePublished={printableNewbieSudokuPageMetadata.publishedAt}
            description={printableNewbieSudokuPageMetadata.metaDescription}
            headline={printableNewbieSudokuPageMetadata.title}
            path={printableNewbieSudokuPageMetadata.path}
        />
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={printableSudokuPageMetadata.path}>Printable sudoku</BreadcrumbListItem>
            <BreadcrumbListItem>Newbie</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>Printable Newbie Sudoku (PDF)</h1>
        <p>
            This is the gentlest booklet on the site: {getDifficultyClueCount(DifficultyEnum.Newbie)} clues out of 81 cells, and every one
            of the blanks is reachable with a full house or a naked single — a property each puzzle was checked for before it went into the
            PDF. It is the booklet to hand a first-time solver, a classroom just learning the rules, or anyone who wants a puzzle that never
            demands a second guess.
        </p>
        <PuzzleBoard givens={PREVIEW_PUZZLE}>Puzzle 1 from the Newbie booklet, one of {PRINTABLE_BOOKLET_SIZE} in the PDF.</PuzzleBoard>
        <PrintableDownloadCard fileName="newbie.pdf" pageCount={PAGE_COUNT} puzzleCount={PRINTABLE_BOOKLET_SIZE} title="Newbie Sudoku" />
        <h2>What is inside the booklet</h2>
        <p>
            The PDF opens with a cover page stating the puzzle and page counts, moves into {PRINTABLE_BOOKLET_SIZE} puzzles printed{' '}
            {PRINTABLE_BOOKLET_PUZZLES_PER_PAGE} to a page, and closes with every solved grid on the final pages so answers never sit next
            to an unsolved puzzle. Every grid is drawn with vector lines and the standard PDF Helvetica font, so it stays sharp at any print
            size and never depends on a scanned image.
        </p>
        <h2>Good for a first sudoku habit</h2>
        <p>
            This is the booklet to print for a short daily habit rather than a long sitting: fold it into a notebook, work one grid at a
            time, and there is never a candidate to write down or a pair to track across the row. It also suits a classroom introducing the
            rules for the first time, since a full class can finish a puzzle in the same short window without anyone stalling on an
            intersection they have not been taught yet. The four-per-page layout still leaves each grid large enough to write in
            comfortably, even for a child’s handwriting, and the answer key at the back means a teacher never has to solve the sheet
            themselves to check it.
        </p>
        <h2>Where to go next</h2>
        <p>
            Once full houses and naked singles feel automatic, step up to the{' '}
            <Link href={printableEasySudokuPageMetadata.path}>printable Easy sudoku booklet</Link>, which adds exactly one technique on top:
            the hidden single. To play Newbie puzzles on a screen instead, visit the{' '}
            <Link href={newbieSudokuPageMetadata.path}>Newbie sudoku lander</Link>. For the full technique ladder and the measured data
            behind these claims, see the <Link href={techniquesPageMetadata.path}>technique index</Link> and the{' '}
            <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link>.
        </p>
        <DifficultyNavigation next={printableEasySudokuPageMetadata} />
    </main>
);

export default PrintableNewbieSudokuPage;
