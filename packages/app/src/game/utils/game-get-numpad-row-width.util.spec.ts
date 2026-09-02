import { describe, expect, it } from '@jest/globals';
import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { GameNumpadDigitsConstant } from '../constant/game-numpad-digits.constant';
import { PanelControlSizeConstant } from '../constant/panel-control-size.constant';

import { gameGetNumpadRowWidth } from './game-get-numpad-row-width.util';

const smallestPhoneWidth = 320;
const iPhoneWidth = 390;
const sixDigitPhoneWidth = 393;
const desktopWidth = 2000;
const digitStep = PanelControlSizeConstant + SpacingConstant.sm;
const rowWidthFor = (digits: number) => digits * digitStep - SpacingConstant.sm;

describe('gameGetNumpadRowWidth', () => {
    it('fits four digits on the smallest supported phone', () => {
        expect(gameGetNumpadRowWidth(smallestPhoneWidth)).toBe(rowWidthFor(4));
    });

    it('fits five digits on a common phone width', () => {
        expect(gameGetNumpadRowWidth(iPhoneWidth)).toBe(rowWidthFor(5));
    });

    it('fits six digits once a row of six clears the panel gutters', () => {
        expect(gameGetNumpadRowWidth(sixDigitPhoneWidth)).toBe(rowWidthFor(6));
    });

    it('never spreads past the full digit count', () => {
        expect(gameGetNumpadRowWidth(desktopWidth)).toBe(rowWidthFor(GameNumpadDigitsConstant.length));
    });

    it('keeps a single digit wide row on an impossibly narrow screen', () => {
        expect(gameGetNumpadRowWidth(0)).toBe(rowWidthFor(1));
    });
});
