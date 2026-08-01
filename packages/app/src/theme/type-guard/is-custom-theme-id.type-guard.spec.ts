import { describe, expect, it } from '@jest/globals';

import { ThemeEnum } from '../enum/theme.enum';

import { isCustomThemeId } from './is-custom-theme-id.type-guard';

describe('isCustomThemeId', () => {
    it('accepts custom-prefixed ids', () => {
        expect(isCustomThemeId('custom-abc123')).toBe(true);
    });

    it('rejects every preset theme id', () => {
        Object.values(ThemeEnum).forEach(theme => {
            expect(isCustomThemeId(theme)).toBe(false);
        });
    });

    it('rejects arbitrary strings', () => {
        expect(isCustomThemeId('mytheme')).toBe(false);
        expect(isCustomThemeId('')).toBe(false);
    });
});
