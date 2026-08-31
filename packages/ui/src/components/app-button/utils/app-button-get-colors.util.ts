import type { ThemeInterface } from '../../../theme/interface/theme.interface';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'donation' | 'inverted' | 'glass';

export const appButtonGetColors = (theme: Pick<ThemeInterface, 'colors'>, variant: AppButtonVariant) => {
    if (variant === 'primary') {
        return {
            backgroundColor: theme.colors.ink,
            borderColor: theme.colors.ink,
            textColor: theme.colors.inkText
        };
    }

    if (variant === 'danger') {
        return {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.surface.border,
            textColor: theme.colors.danger
        };
    }

    if (variant === 'donation' || variant === 'inverted') {
        return {
            backgroundColor: theme.colors.surface.raised,
            borderColor: theme.colors.surface.border,
            textColor: theme.colors.surface.raisedText
        };
    }

    if (variant === 'glass') {
        return {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            textColor: theme.colors.inkText
        };
    }

    if (variant === 'ghost') {
        return {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.surface.border,
            textColor: theme.colors.text.primary
        };
    }

    return {
        backgroundColor: theme.colors.surface.subtle,
        borderColor: theme.colors.surface.border,
        textColor: theme.colors.surface.subtleText
    };
};
