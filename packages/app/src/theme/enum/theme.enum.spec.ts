import { describe, expect, it } from '@jest/globals';

import { ThemeEnum } from './theme.enum';

describe('ThemeEnum', () => {
    it('defines stable persisted theme identifiers', () => {
        expect(Object.values(ThemeEnum)).toEqual(['black-and-white', 'colorful', 'newspaper']);
    });
});
