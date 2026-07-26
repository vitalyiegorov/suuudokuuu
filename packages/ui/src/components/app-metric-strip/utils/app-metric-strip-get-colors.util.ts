import type { ThemeInterface } from '../../../theme/interface/theme.interface';

export type AppMetricStripVariant = 'primary' | 'secondary' | 'ghost';

export const appMetricStripGetColors = (theme: ThemeInterface, variant: AppMetricStripVariant) => {
    if (variant === 'primary') {
        return {
            backgroundColor: theme.colors.black,
            borderColor: theme.colors.black,
            separatorColor: theme.colors.white05,
            textColor: theme.colors.label.inverted
        };
    }

    if (variant === 'ghost') {
        return {
            backgroundColor: theme.colors.background,
            borderColor: 'transparent',
            separatorColor: theme.colors.value.border,
            textColor: theme.colors.label.main
        };
    }

    return {
        backgroundColor: theme.colors.surface.subtle,
        borderColor: theme.colors.value.border,
        separatorColor: theme.colors.value.border,
        textColor: theme.colors.surface.subtleText
    };
};
