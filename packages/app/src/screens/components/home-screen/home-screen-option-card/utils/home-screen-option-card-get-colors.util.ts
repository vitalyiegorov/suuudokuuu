import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const homeScreenOptionCardGetColors = (theme: ThemeInterface, isSelected: boolean) => {
    if (isSelected) {
        return {
            backgroundColor: theme.colors.ink,
            borderColor: theme.colors.ink,
            descriptionColor: theme.colors.inkText,
            titleColor: theme.colors.inkText
        };
    }

    return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.surface.border,
        descriptionColor: theme.colors.text.hint,
        titleColor: theme.colors.text.primary
    };
};
