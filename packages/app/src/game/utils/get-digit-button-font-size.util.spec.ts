/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { DigitButtonFontSizeCapDivider } from '../constant/font-size.constant';
import { PanelControlSizeConstant } from '../constant/panel-control-size.constant';

import { getDigitButtonFontSize } from './get-digit-button-font-size.util';

const NoSystemScale = 1;

describe('getDigitButtonFontSize', () => {
    it('should scale the digit with the button size and the multiplier', () => {
        expect.assertions(2);

        expect(getDigitButtonFontSize(PanelControlSizeConstant, 1, NoSystemScale)).toBeCloseTo(22.4);
        expect(getDigitButtonFontSize(PanelControlSizeConstant, 1.75, NoSystemScale)).toBeCloseTo(39.2);
    });

    it('should enlarge the digit with the system font scale', () => {
        expect.assertions(1);

        expect(getDigitButtonFontSize(PanelControlSizeConstant, 1, 1.5)).toBeCloseTo(33.6);
    });

    it('should clamp the digit to what the button can fit', () => {
        expect.assertions(2);

        const buttonFitFontSize = PanelControlSizeConstant / DigitButtonFontSizeCapDivider;

        expect(getDigitButtonFontSize(PanelControlSizeConstant, 1.75, 1.4)).toBeCloseTo(buttonFitFontSize);
        expect(getDigitButtonFontSize(PanelControlSizeConstant, 1, 3)).toBeCloseTo(buttonFitFontSize);
    });

    it('should never shrink the digit below the in-app font size setting', () => {
        expect.assertions(1);

        expect(getDigitButtonFontSize(PanelControlSizeConstant, 1, 0.8)).toBeCloseTo(22.4);
    });

    it('should stay positive for an unmeasured button', () => {
        expect.assertions(2);

        expect(getDigitButtonFontSize(0, 1, NoSystemScale)).toBeGreaterThan(0);
        expect(getDigitButtonFontSize(-10, 1, NoSystemScale)).toBeGreaterThan(0);
    });
});
