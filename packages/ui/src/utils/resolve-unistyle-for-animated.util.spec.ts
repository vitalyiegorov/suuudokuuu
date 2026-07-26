import { describe, expect, it } from '@jest/globals';

import { resolveUnistyleForAnimated } from './resolve-unistyle-for-animated.util';

describe('resolveUnistyleForAnimated', () => {
    it('keeps every plain style property', () => {
        const style = { backgroundColor: 'red', borderRadius: 8, height: 24 };

        expect(resolveUnistyleForAnimated(style)).toEqual(style);
    });

    it('strips the unistyles metadata that Reanimated rejects as a style value', () => {
        const style = { height: 24, unistyles_hash: {}, unistyles_secrets: { uni__key: 'track' } };

        expect(resolveUnistyleForAnimated(style)).toEqual({ height: 24 });
    });

    it('reads properties that unistyles defines as non-enumerable getters', () => {
        const nonEnumerableWidth = 48;
        const style = {};
        Object.defineProperty(style, 'width', { enumerable: false, get: () => nonEnumerableWidth });

        expect(resolveUnistyleForAnimated(style)).toEqual({ width: nonEnumerableWidth });
    });

    it('leaves an already plain empty style empty', () => {
        expect(resolveUnistyleForAnimated({})).toEqual({});
    });
});
