import { ColorSchemeEnum as ScreenChromeColorSchemeEnum } from '@suuudokuuu/screen-chrome';

export const AppScreenChromeConfig = {
    headerTopInset: 10,
    intensity: 60,
    maxBlurIntensity: 72,
    topFadeHeight: 128,
    headerBackdropHeight: 240,
    colors: {
        [ScreenChromeColorSchemeEnum.LIGHT]: { solid: 'rgba(242,242,240,0.35)', wash: 'rgba(242,242,240,0)' },
        [ScreenChromeColorSchemeEnum.DARK]: { solid: 'rgba(12,12,13,0.32)', wash: 'rgba(12,12,13,0)' }
    }
};
