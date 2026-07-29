import { StyleSheet } from 'react-native-unistyles';

import { Breakpoints } from './src/theme/constant/breakpoints.constant';
import { ContentWidthConstant } from './src/theme/constant/content-width.constant';
import { DefaultUiTheme } from './src/theme/constant/default-ui-theme.constant';
import { RadiusConstant } from './src/theme/constant/radius.constant';
import { SpacingConstant } from './src/theme/constant/spacing.constant';
import { TypographyConstant } from './src/theme/constant/typography.constant';

StyleSheet.configure({
    breakpoints: Breakpoints,
    settings: { adaptiveThemes: false, initialTheme: 'default' },
    themes: {
        default: {
            colors: DefaultUiTheme.colors,
            contentWidth: ContentWidthConstant,
            radius: RadiusConstant,
            spacing: SpacingConstant,
            typography: TypographyConstant
        }
    }
});
