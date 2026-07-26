import { describe, expect, it } from '@jest/globals';

import { HomeScreenTopContentPadding, HomeScreenTopOverlayHeight } from '../constant/home-screen.constant';

import { homeScreenGetContentInsetTop } from './home-screen-get-content-inset-top.util';

const WebSafeAreaTop = 24;
const NotchedPhoneSafeAreaTop = 59;
const OversizedSafeAreaTop = 200;

describe('homeScreenGetContentInsetTop', () => {
    it('starts the content below the top edge fade on a viewport with a small safe area', () => {
        expect(WebSafeAreaTop + homeScreenGetContentInsetTop(WebSafeAreaTop)).toBe(HomeScreenTopOverlayHeight);
    });

    it('starts the content below the top edge fade on a notched phone', () => {
        expect(NotchedPhoneSafeAreaTop + homeScreenGetContentInsetTop(NotchedPhoneSafeAreaTop)).toBe(HomeScreenTopOverlayHeight);
    });

    it('keeps a breathing gap when the safe area already clears the edge fade', () => {
        expect(homeScreenGetContentInsetTop(OversizedSafeAreaTop)).toBe(HomeScreenTopContentPadding);
    });
});
