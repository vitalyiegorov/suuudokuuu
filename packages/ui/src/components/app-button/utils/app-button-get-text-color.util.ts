import type { ThemeInterface } from '../../../theme/interface/theme.interface';
import type { AppButtonVariant } from '../app-button';

export const appButtonGetTextColor = (theme: Pick<ThemeInterface, 'colors'>, variant: AppButtonVariant) => {
    switch (variant) {
        case 'secondary':
            return theme.colors.surface.subtleText;
        case 'ghost':
            return theme.colors.text.primary;
        case 'inverted':
            return theme.colors.surface.raisedText;
        case 'dangerFilled':
            return theme.colors.dangerText;
        case 'boardSelected':
            return theme.colors.board.selectedText;
        default:
            return theme.colors.inkText;
    }
};
