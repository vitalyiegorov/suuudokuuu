import { describe, expect, it } from '@jest/globals';

import { ColorVisionDeficiencyEnum } from '../enum/color-vision-deficiency.enum';

import { getColorDifference } from './get-color-difference.util';
import { simulateColorVisionDeficiency } from './simulate-color-vision-deficiency.util';

const pureRed = { red: 255, green: 0, blue: 0, alpha: 1 };
const pureGreen = { red: 0, green: 255, blue: 0, alpha: 1 };
const pureBlue = { red: 0, green: 0, blue: 255, alpha: 1 };
const neutralGray = { red: 128, green: 128, blue: 128, alpha: 0.4 };
const ConfusablePairMaximumDifference = 30;

describe('simulateColorVisionDeficiency', () => {
    it('collapses red and green for red-green deficiencies', () => {
        [ColorVisionDeficiencyEnum.Protanopia, ColorVisionDeficiencyEnum.Deuteranopia].forEach(deficiency => {
            const simulatedRed = simulateColorVisionDeficiency(pureRed, deficiency);
            const simulatedGreen = simulateColorVisionDeficiency(pureGreen, deficiency);

            expect(getColorDifference(simulatedRed, simulatedGreen)).toBeLessThan(getColorDifference(pureRed, pureGreen));
        });
    });

    it('shifts blue for tritanopia while leaving red mostly intact', () => {
        const simulatedBlue = simulateColorVisionDeficiency(pureBlue, ColorVisionDeficiencyEnum.Tritanopia);
        const simulatedRed = simulateColorVisionDeficiency(pureRed, ColorVisionDeficiencyEnum.Tritanopia);

        expect(getColorDifference(simulatedBlue, pureBlue)).toBeGreaterThan(ConfusablePairMaximumDifference);
        expect(getColorDifference(simulatedRed, pureRed)).toBeLessThan(ConfusablePairMaximumDifference);
    });

    it('leaves neutral colors and alpha untouched', () => {
        const simulated = simulateColorVisionDeficiency(neutralGray, ColorVisionDeficiencyEnum.Deuteranopia);

        expect(simulated.alpha).toBe(neutralGray.alpha);
        expect(getColorDifference(simulated, neutralGray)).toBeLessThan(1);
    });
});
