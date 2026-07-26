import type { ThemeInterface } from '../../../theme/interface/theme.interface';

export const appToggleGetColors = (theme: ThemeInterface, checked: boolean) => {
    if (checked) {
        return {
            knobColor: theme.colors.value.progressActiveText,
            trackBorderColor: 'transparent',
            trackColor: theme.colors.value.progressActive
        };
    }

    return {
        knobColor: theme.colors.surface.subtleHint,
        trackBorderColor: theme.colors.surface.subtleHint,
        trackColor: 'transparent'
    };
};
