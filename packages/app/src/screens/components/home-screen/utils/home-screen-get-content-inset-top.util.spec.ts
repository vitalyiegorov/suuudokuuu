import { describe, expect, it } from '@jest/globals';

import { HomeScreenTopContentPadding, HomeScreenTopOverlayHeight } from '../constant/home-screen.constant';

import { homeScreenGetContentInsetTop } from './home-screen-get-content-inset-top.util';

const WebSafeAreaTop = 24;
const NotchedPhoneSafeAreaTop = 59;
const OversizedSafeAreaTop = 200;
const AndroidPlatformInsetTop = 0;

const getContentTopOffset = (safeAreaTop: number, platformInsetTop: number): number =>
    platformInsetTop + safeAreaTop + homeScreenGetContentInsetTop(safeAreaTop, platformInsetTop);

describe('homeScreenGetContentInsetTop', () => {
    it('starts the content below the top edge fade on a viewport with a small safe area', () => {
        expect(getContentTopOffset(WebSafeAreaTop, AndroidPlatformInsetTop)).toBe(HomeScreenTopOverlayHeight);
    });

    it('starts the content below the top edge fade on a notched phone', () => {
        expect(getContentTopOffset(NotchedPhoneSafeAreaTop, AndroidPlatformInsetTop)).toBe(HomeScreenTopOverlayHeight);
    });

    it('keeps a breathing gap when the safe area already clears the edge fade', () => {
        expect(getContentTopOffset(OversizedSafeAreaTop, AndroidPlatformInsetTop)).toBe(OversizedSafeAreaTop + HomeScreenTopContentPadding);
    });

    it('does not stack the safe area twice when the platform already inset the scroll content', () => {
        expect(getContentTopOffset(NotchedPhoneSafeAreaTop, NotchedPhoneSafeAreaTop)).toBe(HomeScreenTopOverlayHeight);
    });

    it('keeps the breathing gap on a platform-inset viewport with an oversized safe area', () => {
        expect(getContentTopOffset(OversizedSafeAreaTop, OversizedSafeAreaTop)).toBe(OversizedSafeAreaTop + HomeScreenTopContentPadding);
    });
});
