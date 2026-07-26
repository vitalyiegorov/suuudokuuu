import type { ThemeInterface } from './theme.interface';

export interface UnistylesThemeInterface {
    colors: ThemeInterface['colors'];
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    typography: {
        fontFamily: string;
        size: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
        weight: { regular: '400'; medium: '500'; bold: '700' };
    };
    radius: { sm: number; md: number; lg: number; pill: number };
    contentWidth: {
        narrow: number;
        standard: number;
    };
}
