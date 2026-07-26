import type { UnistylesThemeInterface } from '../interface/unistyles-theme.interface';

export const TypographyConstant: UnistylesThemeInterface['typography'] = {
    fontFamily: 'Inter_500Medium',
    size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 30
    },
    weight: {
        regular: '400',
        medium: '500',
        bold: '700'
    }
};
