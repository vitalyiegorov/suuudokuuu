import { describe, expect, it } from '@jest/globals';

import {
    HintNarrationLineCountConstant,
    HintSurfaceMaxHeightConstant,
    HintSurfaceMinHeightConstant,
    HintSurfaceRoomyHeightConstant,
    HintSurfaceStandardHeightConstant
} from '../constant/hint-surface.constant';

import { gameGetHintSurfaceMetrics } from './game-get-hint-surface-metrics.util';

const iPhoneWidth = 390;
const tabletPortraitWidth = 768;
const tallPhoneToolsSlotHeight = 200;
const roomyToolsSlotHeight = 130;
const standardToolsSlotHeight = 80;
const crampedToolsSlotHeight = 91;

describe('gameGetHintSurfaceMetrics', () => {
    it('keeps the bounded wide card at its roomy height', () => {
        expect(gameGetHintSurfaceMetrics({ isWideLayout: true, screenWidth: tabletPortraitWidth, toolsSlotHeight: 0 })).toStrictEqual({
            height: HintSurfaceRoomyHeightConstant,
            isRoomyLayout: true,
            narrationLineCount: HintNarrationLineCountConstant
        });
    });

    it('never grows past the roomy height plus one line of air on a tall phone', () => {
        expect(
            gameGetHintSurfaceMetrics({ isWideLayout: false, screenWidth: iPhoneWidth, toolsSlotHeight: tallPhoneToolsSlotHeight })
        ).toStrictEqual({
            height: HintSurfaceMaxHeightConstant,
            isRoomyLayout: true,
            narrationLineCount: HintNarrationLineCountConstant
        });
    });

    it('takes the roomy type scale once the space below the board affords it', () => {
        const metrics = gameGetHintSurfaceMetrics({
            isWideLayout: false,
            screenWidth: iPhoneWidth,
            toolsSlotHeight: roomyToolsSlotHeight
        });

        expect(metrics.isRoomyLayout).toBe(true);
        expect(metrics.narrationLineCount).toBe(HintNarrationLineCountConstant);
        expect(metrics.height).toBeGreaterThanOrEqual(HintSurfaceRoomyHeightConstant);
    });

    it('falls back to the standard type scale while still reserving three narration lines', () => {
        const metrics = gameGetHintSurfaceMetrics({
            isWideLayout: false,
            screenWidth: iPhoneWidth,
            toolsSlotHeight: standardToolsSlotHeight
        });

        expect(metrics.isRoomyLayout).toBe(false);
        expect(metrics.narrationLineCount).toBe(HintNarrationLineCountConstant);
        expect(metrics.height).toBeGreaterThanOrEqual(HintSurfaceStandardHeightConstant);
    });

    it('drops narration lines instead of the board when a single numpad row leaves little room', () => {
        const metrics = gameGetHintSurfaceMetrics({
            isWideLayout: false,
            screenWidth: tabletPortraitWidth,
            toolsSlotHeight: crampedToolsSlotHeight
        });

        expect(metrics.height).toBeLessThan(HintSurfaceStandardHeightConstant);
        expect(metrics.narrationLineCount).toBeLessThan(HintNarrationLineCountConstant);
    });

    it('never drops below a single readable narration line', () => {
        expect(gameGetHintSurfaceMetrics({ isWideLayout: false, screenWidth: tabletPortraitWidth, toolsSlotHeight: 0 })).toStrictEqual({
            height: HintSurfaceMinHeightConstant,
            isRoomyLayout: false,
            narrationLineCount: 1
        });
    });
});
