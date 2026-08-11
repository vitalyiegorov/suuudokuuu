import type { ThemeInterface } from '../../../theme/interface/theme.interface';

export const appToggleGetColors = (theme: Pick<ThemeInterface, 'colors'>, checked: boolean) => {
    if (checked) {
        return {
            knobColor: theme.colors.numpad.trackFilledText,
            trackBorderColor: 'transparent',
            trackColor: theme.colors.numpad.trackFilled
        };
    }

    return {
        knobColor: theme.colors.surface.subtleHint,
        trackBorderColor: theme.colors.surface.subtleHint,
        trackColor: 'transparent'
    };
};
