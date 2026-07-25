import { SCREEN_CHROME_DEFAULT_CONFIG } from '@suuudokuuu/screen-chrome';

import { AppScreenChromeConfig } from './screen-chrome-config.constant';

const resolvedScreenChromeConfig = { ...SCREEN_CHROME_DEFAULT_CONFIG, ...AppScreenChromeConfig };
const ScreenChromeContentGap = 8;

export const ScreenChromeContentInsetTop =
    resolvedScreenChromeConfig.headerTopInset + resolvedScreenChromeConfig.headerHeight + ScreenChromeContentGap;
