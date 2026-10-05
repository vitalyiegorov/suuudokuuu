import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

import { getSeparatorKey } from '../../src/utils/get-separator-key.util';

describe('getSeparatorKey', () => {
    it('should derive the key from the item key instead of its position', () => {
        const item = createElement('div', { key: '.2' });

        expect(getSeparatorKey(item, 0)).toBe('.2-separator');
    });

    it('should keep the same key when a removed sibling shifts the item position', () => {
        const item = createElement('div', { key: '.3' });
        const keyBeforeRemoval = getSeparatorKey(item, 3);
        const keyAfterRemoval = getSeparatorKey(item, 2);

        expect(keyAfterRemoval).toBe(keyBeforeRemoval);
    });

    it('should give sibling items distinct keys', () => {
        const firstItem = createElement('div', { key: '.0' });
        const secondItem = createElement('div', { key: '.1' });

        expect(getSeparatorKey(firstItem, 0)).not.toBe(getSeparatorKey(secondItem, 1));
    });

    it('should fall back to the position for nodes without a key', () => {
        expect(getSeparatorKey('plain text', 3)).toBe('3-separator');
    });
});
