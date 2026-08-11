import type { ThemeInterface } from '../../../theme/interface/theme.interface';

export type AppMetricStripVariant = 'primary' | 'secondary' | 'ghost';

export const appMetricStripGetColors = (theme: Pick<ThemeInterface, 'colors'>, variant: AppMetricStripVariant) => {
    if (variant === 'primary') {
        return {
            backgroundColor: theme.colors.ink,
            borderColor: theme.colors.ink,
            separatorColor: theme.colors.overlayDark,
            textColor: theme.colors.inkText
        };
    }

    if (variant === 'ghost') {
        return {
            backgroundColor: theme.colors.background,
            borderColor: 'transparent',
            separatorColor: theme.colors.surface.border,
            textColor: theme.colors.text.primary
        };
    }

    return {
        backgroundColor: theme.colors.surface.subtle,
        borderColor: theme.colors.surface.border,
        separatorColor: theme.colors.surface.border,
        textColor: theme.colors.surface.subtleText
    };
};
