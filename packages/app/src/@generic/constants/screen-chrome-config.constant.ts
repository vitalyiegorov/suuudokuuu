import { ContentWidthConstant } from '@suuudokuuu/ui';

import { SCREEN_CHROME_DEFAULT_CONFIG } from '@rnw-community/react-native-screen-chrome';

import { PageHorizontalPaddingConstant } from './page-horizontal-padding.constant';

export const AppScreenChromeWashAlpha = 0;

export const AppScreenChromeLayoutConfig = {
    contentHorizontalPadding: PageHorizontalPaddingConstant,
    contentMaxWidth: ContentWidthConstant.standard,
    headerTopInset: 10
};

export const AppScreenChromeConfig = {
    headerHeight: SCREEN_CHROME_DEFAULT_CONFIG.headerHeight + AppScreenChromeLayoutConfig.headerTopInset,
    intensity: 60,
    maxBlurIntensity: 72,
    topFadeHeight: 128,
    headerBackdropHeight: 240
};
