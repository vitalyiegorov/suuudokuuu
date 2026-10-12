import { createElement, isValidElement } from 'react';
import { describe, expect, it } from 'vitest';

import { interleaveChildren } from '../../src/utils/interleave-children.util';

describe('interleaveChildren', () => {
    it('keeps no separators for zero or one visible child', () => {
        const onlyChild = createElement('span', { key: 'only' });

        expect(interleaveChildren(null, createElement('hr'))).toEqual([]);
        expect(interleaveChildren([false, null, onlyChild], createElement('hr'))).toHaveLength(1);
    });

    it('inserts separators only between visible children', () => {
        const children = ['first', null, 'second', false, 'third'];
        const items = interleaveChildren(children, createElement('hr', { title: 'separator' }));

        expect(items).toHaveLength(5);
        expect(items.filter(item => !isValidElement(item))).toEqual(['first', 'second', 'third']);
        expect(items.filter(isValidElement).map(item => item.key)).toEqual(['1-separator', '2-separator']);
    });

    it('preserves separator keys when keyed children change position', () => {
        const firstChild = createElement('span', { key: 'first' });
        const secondChild = createElement('span', { key: 'second' });
        const thirdChild = createElement('span', { key: 'third' });
        const separator = createElement('hr');
        const before = interleaveChildren([firstChild, secondChild, thirdChild], separator).filter(isValidElement);
        const after = interleaveChildren([firstChild, thirdChild], separator).filter(isValidElement);

        expect(before[3]?.key).toBe(after[1]?.key);
        expect(before[1]?.key).not.toBe(before[3]?.key);
        expect(separator.key).toBeNull();
    });
});
