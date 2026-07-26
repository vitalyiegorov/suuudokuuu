import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const homeScreenOptionCardGetColors = (theme: ThemeInterface, isSelected: boolean) => {
    if (isSelected) {
        return {
            backgroundColor: theme.colors.black,
            borderColor: theme.colors.black,
            descriptionColor: theme.colors.label.inverted,
            titleColor: theme.colors.label.inverted
        };
    }

    return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.candidate.border,
        descriptionColor: theme.colors.label.hint,
        titleColor: theme.colors.label.main
    };
};
