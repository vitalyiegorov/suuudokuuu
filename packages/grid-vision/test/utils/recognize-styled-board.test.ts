import { createCanvas } from '@napi-rs/canvas';
import { describe, expect, it } from 'vitest';

import { WHOLE_IMAGE_REGION, readCanvasRegion } from '../../scripts/shared/read-canvas-region';
import { GridRecognitionKindEnum, recognizeGrid } from '../../src';

import type { SKRSContext2D } from '@napi-rs/canvas';

const PUZZLE = '..4135.27.5....13....2..945.1.6357.4.274.5..6.3.....4751..7....9514.4..5..367...5';
const GRID_SIZE = 9;
const CELL_SIZE = 46;
const BOARD_SIZE = GRID_SIZE * CELL_SIZE;
const BOARD_X = 93;
const BOARD_Y = 300;
const PAGE_WIDTH = 600;
const PAGE_HEIGHT = 1100;
const DIGIT_SIZE_RATIO = 0.62;
const PENCIL_SIZE_RATIO = 0.22;
const PENCIL_MARKS = ['1', '5', '9'];
const PIXEL_OFFSET = 0.5;
const PENCIL_MARK_STEP = CELL_SIZE / 3;
const CHAIN_LINES_IN_CELLS = ['0.2 1.5 8.8 1.5', '4.5 1.5 4.5 7.5', '0.5 6.5 6.5 6.5'];
const GREEN_CELL_MASK = [
    '..g......',
    '..g......',
    '..g......',
    '..g......',
    '..g......',
    '..g......',
    '.........',
    '.........',
    '.....gggg'
].join('');
const HINT_CARD_GAP = 14;
const HINT_CARD_OVERHANG = 60;
const HINT_CARD_HEIGHT = 150;
const HINT_CARD_RADIUS = 24;
const HINT_TEXT_OFFSET = 60;
const TITLE_X = 40;
const TITLE_Y = 220;
const READS = [
    { isSmooth: true, quality: 90 },
    { isSmooth: false, quality: 75 }
];

interface SceneInterface {
    readonly name: string;
    readonly page: string;
    readonly board: string;
    readonly line: string;
    readonly ink: string;
    readonly pencil: string | null;
    readonly paintCell: (cell: number) => readonly [string, string] | null;
    readonly drawOverlay: (context: SKRSContext2D) => void;
}

const drawChainLines = (context: SKRSContext2D): void => {
    context.strokeStyle = '#e02020';
    context.lineWidth = 3;
    context.beginPath();
    for (const line of CHAIN_LINES_IN_CELLS) {
        const [fromX, fromY, toX, toY] = line.split(' ').map(position => Number(position) * CELL_SIZE);

        context.moveTo(BOARD_X + fromX, BOARD_Y + fromY);
        context.lineTo(BOARD_X + toX, BOARD_Y + toY);
    }
    context.stroke();
};

const SCENES: SceneInterface[] = [
    {
        name: 'a dimmed board with white digits on green cells under a hint card',
        page: '#0e1113',
        board: '#7a7a7a',
        line: '#3a3a3a',
        ink: '#141414',
        pencil: null,
        paintCell: cell => {
            if (GREEN_CELL_MASK[cell] === 'g') {
                return ['#3fbf5a', '#ffffff'];
            }

            return cell % GRID_SIZE === 2 ? ['#ffffff', '#141414'] : null;
        },
        drawOverlay: context => {
            context.fillStyle = '#ffffff';
            context.beginPath();
            context.roundRect(
                BOARD_X - HINT_CARD_OVERHANG,
                BOARD_Y + BOARD_SIZE + HINT_CARD_GAP,
                BOARD_SIZE + 2 * HINT_CARD_OVERHANG,
                HINT_CARD_HEIGHT,
                HINT_CARD_RADIUS
            );
            context.fill();
            context.fillStyle = '#222222';
            context.font = '26px sans-serif';
            context.fillText('Last Possible Number', PAGE_WIDTH / 2, BOARD_Y + BOARD_SIZE + HINT_TEXT_OFFSET);
        }
    },
    {
        name: 'a dim violet board with light highlighted cells',
        page: '#0e1113',
        board: '#5b4a60',
        line: '#2c2230',
        ink: '#1a1020',
        pencil: '#3a2a40',
        paintCell: cell => (cell < GRID_SIZE || cell % GRID_SIZE === 5 ? ['#f2d4f0', '#7a1f78'] : null),
        drawOverlay: context => {
            context.strokeStyle = '#c03fb0';
            context.lineWidth = 4;
            context.strokeRect(BOARD_X, BOARD_Y, BOARD_SIZE, CELL_SIZE);
        }
    },
    {
        name: 'chain lines drawn across digits and pencil marks',
        page: '#ffffff',
        board: '#ffffff',
        line: '#222222',
        ink: '#111111',
        pencil: '#555555',
        paintCell: () => null,
        drawOverlay: drawChainLines
    }
];

const drawCell = (context: SKRSContext2D, scene: SceneInterface, cell: number): void => {
    const left = BOARD_X + (cell % GRID_SIZE) * CELL_SIZE;
    const top = BOARD_Y + Math.floor(cell / GRID_SIZE) * CELL_SIZE;
    const paint = scene.paintCell(cell);

    const [fill, ink] = paint ?? [null, scene.ink];

    if (fill !== null) {
        context.fillStyle = fill;
        context.fillRect(left, top, CELL_SIZE, CELL_SIZE);
    }

    if (PUZZLE[cell] !== '.') {
        context.fillStyle = ink;
        context.font = `${Math.round(CELL_SIZE * DIGIT_SIZE_RATIO)}px sans-serif`;
        context.fillText(PUZZLE[cell], left + CELL_SIZE / 2, top + CELL_SIZE / 2 + 1);
    } else if (scene.pencil !== null) {
        context.fillStyle = scene.pencil;
        context.font = `${Math.round(CELL_SIZE * PENCIL_SIZE_RATIO)}px sans-serif`;
        PENCIL_MARKS.forEach((mark, order) => {
            context.fillText(mark, left + (order + PIXEL_OFFSET) * PENCIL_MARK_STEP, top + (order + PIXEL_OFFSET) * PENCIL_MARK_STEP);
        });
    }
};

const renderScene = (scene: SceneInterface) => {
    const canvas = createCanvas(PAGE_WIDTH, PAGE_HEIGHT);
    const context = canvas.getContext('2d');

    context.fillStyle = scene.page;
    context.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
    context.fillStyle = '#9aa0a6';
    context.font = '28px sans-serif';
    context.fillText('What is this method?', TITLE_X, TITLE_Y);
    context.fillStyle = scene.board;
    context.fillRect(BOARD_X, BOARD_Y, BOARD_SIZE, BOARD_SIZE);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let cell = 0; cell < PUZZLE.length; cell += 1) {
        drawCell(context, scene, cell);
    }
    context.strokeStyle = scene.line;
    for (let line = 0; line <= GRID_SIZE; line += 1) {
        context.lineWidth = line % 3 === 0 ? 3 : 1;
        context.beginPath();
        context.moveTo(BOARD_X + line * CELL_SIZE, BOARD_Y);
        context.lineTo(BOARD_X + line * CELL_SIZE, BOARD_Y + BOARD_SIZE);
        context.moveTo(BOARD_X, BOARD_Y + line * CELL_SIZE);
        context.lineTo(BOARD_X + BOARD_SIZE, BOARD_Y + line * CELL_SIZE);
        context.stroke();
    }
    scene.drawOverlay(context);

    return canvas;
};

describe('recognizeGrid on styled and annotated boards', () => {
    describe.each(SCENES)('$name', scene => {
        const canvas = renderScene(scene);

        it.each(READS)('should read every cell at %o', ({ isSmooth, quality }) => {
            expect(recognizeGrid(readCanvasRegion(canvas, WHOLE_IMAGE_REGION, isSmooth, quality))).toMatchObject({
                kind: GridRecognitionKindEnum.RECOGNIZED,
                puzzleString: PUZZLE
            });
        });
    });
});
