import { describe, expect, it } from '@jest/globals';
import { SpacingConstant } from '@suuudokuuu/ui/theme';

import { PanelControlSizeConstant } from '../constant/panel-control-size.constant';

import { gameGetNumpadHeight } from './game-get-numpad-height.util';

const smallestPhoneWidth = 320;
const iPhoneWidth = 390;
const tabletPortraitWidth = 768;
const heightFor = (rowCount: number) => rowCount * PanelControlSizeConstant + (rowCount - 1) * SpacingConstant.sm;

describe('gameGetNumpadHeight', () => {
    it('stacks three rows when only four digits fit per row', () => {
        expect(gameGetNumpadHeight(smallestPhoneWidth)).toBe(heightFor(3));
    });

    it('stacks two rows on a common phone width', () => {
        expect(gameGetNumpadHeight(iPhoneWidth)).toBe(heightFor(2));
    });

    it('keeps a single row once every digit fits side by side', () => {
        expect(gameGetNumpadHeight(tabletPortraitWidth)).toBe(heightFor(1));
    });
});
