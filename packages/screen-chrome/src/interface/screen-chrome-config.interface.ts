import { ColorSchemeEnum } from '../enum/color-scheme.enum';

export type EdgeFadePosition = 'top' | 'bottom';

export interface ScreenChromeColorSetInterface {
    readonly solid: string;
    readonly wash: string;
}
export interface ScreenChromeConfigInterface {
    readonly contentHorizontalPadding: number;
    readonly contentMaxWidth: number;
    readonly headerHeight: number;
    readonly headerTopInset: number;
    readonly topFadeHeight: number;
    readonly bottomFadeHeight: number;
    readonly headerBackdropHeight: number;
    readonly intensity: number;
    readonly maxBlurIntensity: number;
    readonly collapseStart: number;
    readonly smallTitleStart: number;
    readonly largeTitleEnd: number;
    readonly collapseEnd: number;
    readonly scrollEventThrottle: number;
    readonly snapToCollapse: boolean;
    readonly colors: Record<ColorSchemeEnum, ScreenChromeColorSetInterface>;
    readonly maskStops: Record<EdgeFadePosition, Record<number, { readonly color: string }>>;
    readonly blurIntensityScale: Record<ColorSchemeEnum, number>;
}

export interface ScreenChromeConfigOverridesInterface extends Partial<
    Omit<ScreenChromeConfigInterface, 'colors' | 'maskStops' | 'blurIntensityScale'>
> {
    readonly colors?: Partial<Record<ColorSchemeEnum, Partial<ScreenChromeColorSetInterface>>>;
    readonly maskStops?: Partial<Record<EdgeFadePosition, Record<number, { readonly color: string }>>>;
    readonly blurIntensityScale?: Partial<Record<ColorSchemeEnum, number>>;
}
