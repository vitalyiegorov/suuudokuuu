import { ScreenChromeConfigInterface } from '../interface/screen-chrome-config.interface';

import { SCREEN_CHROME_SHARED_DEFAULT_CONFIG } from './screen-chrome-shared-default-config.constant';

export const SCREEN_CHROME_DEFAULT_CONFIG: ScreenChromeConfigInterface = {
    ...SCREEN_CHROME_SHARED_DEFAULT_CONFIG,
    topFadeHeight: 146,
    bottomFadeHeight: 146,
    headerBackdropHeight: 220,
    maxBlurIntensity: 45
};
