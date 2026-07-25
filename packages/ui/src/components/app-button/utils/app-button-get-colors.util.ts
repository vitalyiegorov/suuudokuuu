import type { ThemeInterface } from '../../../theme/interface/theme.interface';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'donation' | 'inverted' | 'glass';

export const appButtonGetColors = (theme: ThemeInterface, variant: AppButtonVariant) => {
    if (variant === 'primary') {
        return {
            backgroundColor: theme.colors.black,
            borderColor: theme.colors.black,
            textColor: theme.colors.label.inverted
        };
    }

    if (variant === 'danger') {
        return {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.value.border,
            textColor: theme.colors.red
        };
    }

    if (variant === 'donation' || variant === 'inverted') {
        return {
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.value.border,
            textColor: theme.colors.label.main
        };
    }

    if (variant === 'glass') {
        return {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            textColor: theme.colors.label.inverted
        };
    }

    if (variant === 'ghost') {
        return {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.value.border,
            textColor: theme.colors.label.main
        };
    }

    return {
        backgroundColor: theme.colors.cell.highlighted,
        borderColor: theme.colors.value.border,
        textColor: theme.colors.label.main
    };
};
