import { ColorSchemeEnum } from '../enum/color-scheme.enum';
import { ScreenChromeConfigInterface } from '../interface/screen-chrome-config.interface';

export const SCREEN_CHROME_SHARED_DEFAULT_CONFIG: Omit<
    ScreenChromeConfigInterface,
    'topFadeHeight' | 'bottomFadeHeight' | 'headerBackdropHeight' | 'maxBlurIntensity'
> = {
    contentMaxWidth: 0,
    headerHeight: 64,
    headerTopInset: 0,
    intensity: 20,
    collapseStart: 0,
    smallTitleStart: 40,
    largeTitleEnd: 60,
    collapseEnd: 80,
    scrollEventThrottle: 16,
    snapToCollapse: false,
    colors: {
        [ColorSchemeEnum.LIGHT]: { solid: 'rgba(255,255,255,0.7)', wash: 'rgba(255,255,255,0.15)' },
        [ColorSchemeEnum.DARK]: { solid: 'rgba(0,0,0,0.4)', wash: 'rgba(0,0,0,0.08)' }
    },
    maskStops: {
        top: {
            0: { color: 'rgba(0,0,0,0.99)' },
            0.5: { color: '#000000' },
            1: { color: 'transparent' }
        },
        bottom: {
            0: { color: 'transparent' },
            0.5: { color: '#000000' },
            1: { color: 'rgba(0,0,0,0.99)' }
        }
    },
    blurIntensityScale: {
        [ColorSchemeEnum.LIGHT]: 1,
        [ColorSchemeEnum.DARK]: 1
    }
};
