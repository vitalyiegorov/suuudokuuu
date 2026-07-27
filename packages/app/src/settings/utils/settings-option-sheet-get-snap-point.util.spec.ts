/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { settingsOptionSheetGetSnapPoint } from './settings-option-sheet-get-snap-point.util';

describe('settingsOptionSheetGetSnapPoint', () => {
    it('should express a detent as a rounded percentage', () => {
        expect.assertions(3);

        expect(settingsOptionSheetGetSnapPoint(0.5)).toBe('50%');
        expect(settingsOptionSheetGetSnapPoint(1)).toBe('100%');
        expect(settingsOptionSheetGetSnapPoint(0.333)).toBe('33%');
    });
});
