import { describe, expect, it } from '@jest/globals';

import { applyColorAlpha } from './apply-color-alpha.util';

const OpaqueAlpha = 1;
const WashAlpha = 0;
const SolidAlpha = 0.4;

describe('applyColorAlpha', () => {
    it('converts a six digit hex colour to rgba', () => {
        expect(applyColorAlpha('#2A3B4D', SolidAlpha)).toBe('rgba(42, 59, 77, 0.4)');
    });

    it('expands a three digit hex colour', () => {
        expect(applyColorAlpha('#fff', OpaqueAlpha)).toBe('rgba(255, 255, 255, 1)');
    });

    it('replaces the alpha of an existing rgba colour', () => {
        expect(applyColorAlpha('rgba(1, 1, 1, 0.9)', WashAlpha)).toBe('rgba(1, 1, 1, 0)');
    });

    it('adds an alpha to an rgb colour', () => {
        expect(applyColorAlpha('rgb(245, 245, 245)', SolidAlpha)).toBe('rgba(245, 245, 245, 0.4)');
    });
});
