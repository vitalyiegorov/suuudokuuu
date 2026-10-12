import type { ThemeInterface } from './theme.interface';

export interface UnistylesThemeInterface {
    readonly colors: ThemeInterface['colors'];
    readonly spacing: {
        readonly xs: number;
        readonly sm: number;
        readonly md: number;
        readonly lg: number;
        readonly xl: number;
        readonly xxl: number;
    };
    readonly typography: {
        readonly fontFamily: string;
        readonly size: {
            readonly xs: number;
            readonly sm: number;
            readonly md: number;
            readonly lg: number;
            readonly xl: number;
            readonly xxl: number;
        };
        readonly weight: { readonly regular: '400'; readonly medium: '500'; readonly bold: '700' };
    };
    readonly radius: { readonly sm: number; readonly md: number; readonly lg: number; readonly pill: number };
    readonly contentWidth: {
        readonly narrow: number;
        readonly standard: number;
    };
}
