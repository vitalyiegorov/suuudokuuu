import { describe, expect, it } from 'vitest';

import { WHOLE_IMAGE_REGION, readCanvasRegion } from '../../scripts/shared/read-canvas-region';
import { renderPhoneScreenshot } from '../../scripts/shared/render-phone-screenshot';
import { SeededRandom } from '../../scripts/shared/seeded-random';
import { GridRecognitionKindEnum, recognizeGrid } from '../../src';

import type { GridRecognitionType } from '../../src';
import type { Canvas } from '@napi-rs/canvas';

const PRINTED = '5...794.......8..7.7.3542.8..4..3579.3.4.1..2...7..3..9...4..6..5..8...3.68......';
const SOLUTION = '581279436342618957679354218214863579735491682896725341923147865457986123168532794';
const ENTRY_PROBABILITY = 0.74;
const SEED_STEP = 7919;
const MAXIMUM_MISSED_ENTRY_COUNT = 2;
const READS = [
    { isSmooth: true, quality: 100 },
    { isSmooth: true, quality: 80 },
    { isSmooth: false, quality: 100 },
    { isSmooth: false, quality: 80 }
];

const renderScene = (seed: number) => {
    const random = new SeededRandom(seed * SEED_STEP);
    const entryMask = Array.from(PRINTED, digit => (digit === '.' && random.chance(ENTRY_PROBABILITY) ? 'h' : '.')).join('');
    const digits = Array.from(PRINTED, (digit, cell) => (entryMask[cell] === 'h' ? SOLUTION[cell] : digit)).join('');

    return { digits, entryMask, source: renderPhoneScreenshot(random, digits, entryMask, 'sans-serif') };
};

const readScene = (source: Canvas, isSmooth: boolean, quality: number) => {
    const overview = readCanvasRegion(source, WHOLE_IMAGE_REGION, isSmooth, quality);
    const located = recognizeGrid(overview, Math.max(source.width, source.height) / Math.max(overview.width, overview.height));
    const closerRegion = located.kind === GridRecognitionKindEnum.LOCATED ? located.closerRegion : null;

    return {
        closerRegion,
        closer: closerRegion === null ? located : recognizeGrid(readCanvasRegion(source, closerRegion, isSmooth, quality))
    };
};

const countEntryFlags = (recognition: GridRecognitionType, entryMask: string, isEntry: boolean): number =>
    recognition.kind === GridRecognitionKindEnum.RECOGNIZED
        ? recognition.handwritten.filter((isFlagged, cell) => isFlagged && (entryMask[cell] === 'h') === isEntry).length
        : -1;

describe('recognizeGrid on a phone screenshot of a photographed board', () => {
    describe.each([1, 2, 3, 4])('scene %i', seed => {
        const { digits, entryMask, source } = renderScene(seed);

        it.each(READS)('should read every digit from a closer region and split entries from clues at %o', ({ isSmooth, quality }) => {
            const { closerRegion, closer } = readScene(source, isSmooth, quality);
            const entryCount = entryMask.replaceAll('.', '').length;

            expect(entryCount).toBeGreaterThan(PRINTED.replaceAll('.', '').length);
            expect(closerRegion).not.toBeNull();
            expect(closer).toMatchObject({ kind: GridRecognitionKindEnum.RECOGNIZED, puzzleString: digits });
            expect(countEntryFlags(closer, entryMask, false)).toBe(0);
            expect(countEntryFlags(closer, entryMask, true)).toBeGreaterThanOrEqual(entryCount - MAXIMUM_MISSED_ENTRY_COUNT);
        });
    });
});
