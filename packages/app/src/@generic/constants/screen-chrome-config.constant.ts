import { ColorSchemeEnum as ScreenChromeColorSchemeEnum } from '@suuudokuuu/screen-chrome';

export const AppScreenChromeConfig = {
    headerTopInset: 10,
    intensity: 60,
    maxBlurIntensity: 72,
    topFadeHeight: 128,
    headerBackdropHeight: 240,
    colors: {
        [ScreenChromeColorSchemeEnum.LIGHT]: { solid: 'rgba(242,242,240,0.35)', wash: 'rgba(242,242,240,0)' },
        [ScreenChromeColorSchemeEnum.DARK]: { solid: 'rgba(1,1,1,0.4)', wash: 'rgba(1,1,1,0)' }
    }
};
