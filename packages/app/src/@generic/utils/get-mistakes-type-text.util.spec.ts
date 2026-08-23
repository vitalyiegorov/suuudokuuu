import { describe, expect, it } from '@jest/globals';
import { i18n } from '@lingui/core';

import { getMistakesTypeText } from './get-mistakes-type-text.util';

const StandardMistakes = 3;
const RelaxedMistakes = 99;

describe('getMistakesTypeText', () => {
    it('should label a zero mistake allowance as hardcore', () => {
        expect.assertions(1);

        expect(i18n._(getMistakesTypeText(0))).toBe('Hardcore');
    });

    it('should label the three mistake allowance as standard', () => {
        expect.assertions(1);

        expect(i18n._(getMistakesTypeText(StandardMistakes))).toBe('Standard');
    });

    it('should label any other allowance as relaxed', () => {
        expect.assertions(2);

        expect(i18n._(getMistakesTypeText(RelaxedMistakes))).toBe('Relaxed');
        expect(i18n._(getMistakesTypeText(1))).toBe('Relaxed');
    });
});
