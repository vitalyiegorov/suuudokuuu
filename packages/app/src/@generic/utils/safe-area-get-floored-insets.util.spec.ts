import { describe, expect, it } from '@jest/globals';

import { WebSafeAreaFloorConstant } from '../constants/web-safe-area-floor.constant';

import { safeAreaGetFlooredInsets } from './safe-area-get-floored-insets.util';

describe('safeAreaGetFlooredInsets', () => {
    it('raises a browser without safe area insets to the floor', () => {
        expect(safeAreaGetFlooredInsets({ bottom: 0, left: 0, right: 0, top: 0 })).toEqual(WebSafeAreaFloorConstant);
    });

    it('keeps real device insets that already exceed the floor', () => {
        const deviceInsets = { bottom: 34, left: 0, right: 0, top: 59 };

        expect(safeAreaGetFlooredInsets(deviceInsets)).toEqual(deviceInsets);
    });

    it('floors each edge independently', () => {
        const landscapeInsets = { bottom: 21, left: 44, right: 44, top: 0 };

        expect(safeAreaGetFlooredInsets(landscapeInsets)).toEqual({
            bottom: WebSafeAreaFloorConstant.bottom,
            left: 44,
            right: 44,
            top: WebSafeAreaFloorConstant.top
        });
    });
});
