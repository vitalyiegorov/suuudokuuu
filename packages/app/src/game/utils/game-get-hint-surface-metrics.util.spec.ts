import { describe, expect, it } from '@jest/globals';

import {
    HintNarrationLineCountConstant,
    HintSurfaceNarrowHeightConstant,
    HintSurfaceNarrowMinHeightConstant,
    HintSurfaceWideHeightConstant
} from '../constant/hint-surface.constant';

import { gameGetHintSurfaceMetrics } from './game-get-hint-surface-metrics.util';

const iPhoneWidth = 390;
const tabletPortraitWidth = 768;
const roomyToolsSlotHeight = 113;
const crampedToolsSlotHeight = 91;

describe('gameGetHintSurfaceMetrics', () => {
    it('keeps the bounded desktop card at its full height', () => {
        expect(gameGetHintSurfaceMetrics({ isWideLayout: true, screenWidth: tabletPortraitWidth, toolsSlotHeight: 0 })).toStrictEqual({
            height: HintSurfaceWideHeightConstant,
            narrationLineCount: HintNarrationLineCountConstant
        });
    });

    it('reserves the full three narration lines when the space below the board allows it', () => {
        expect(
            gameGetHintSurfaceMetrics({ isWideLayout: false, screenWidth: iPhoneWidth, toolsSlotHeight: roomyToolsSlotHeight })
        ).toStrictEqual({ height: HintSurfaceNarrowHeightConstant, narrationLineCount: HintNarrationLineCountConstant });
    });

    it('shrinks to the space below the board when a single numpad row leaves little room', () => {
        const metrics = gameGetHintSurfaceMetrics({
            isWideLayout: false,
            screenWidth: tabletPortraitWidth,
            toolsSlotHeight: crampedToolsSlotHeight
        });

        expect(metrics.height).toBeLessThan(HintSurfaceNarrowHeightConstant);
        expect(metrics.narrationLineCount).toBeLessThan(HintNarrationLineCountConstant);
    });

    it('never drops below a single readable narration line', () => {
        expect(gameGetHintSurfaceMetrics({ isWideLayout: false, screenWidth: tabletPortraitWidth, toolsSlotHeight: 0 })).toStrictEqual({
            height: HintSurfaceNarrowMinHeightConstant,
            narrationLineCount: 1
        });
    });
});
