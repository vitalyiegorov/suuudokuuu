import { describe, expect, it } from '@jest/globals';

import { getMistakesTypeText } from './get-mistakes-type-text.util';

const StandardMistakes = 3;
const RelaxedMistakes = 99;

describe('getMistakesTypeText', () => {
    it('should label a zero mistake allowance as hardcore', () => {
        expect.assertions(1);

        expect(getMistakesTypeText(0)).toBe('Hardcore');
    });

    it('should label the three mistake allowance as standard', () => {
        expect.assertions(1);

        expect(getMistakesTypeText(StandardMistakes)).toBe('Standard');
    });

    it('should label any other allowance as relaxed', () => {
        expect.assertions(2);

        expect(getMistakesTypeText(RelaxedMistakes)).toBe('Relaxed');
        expect(getMistakesTypeText(1)).toBe('Relaxed');
    });
});
