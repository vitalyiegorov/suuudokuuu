import { LucideMoon, LucideSunMedium } from 'lucide-react-native';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';
import { BlackButton } from '../black-button/black-button';

import { ThemeButtonStyles } from './theme-button.styles';

import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

export const ThemeButton = ({ style, ...props }: ComponentProps<typeof BlackButton>) => {
    const { toggleColorSchema, colorScheme, theme } = use(ThemeContext);

    const ThemeIcon = colorScheme === ColorSchemaEnum.Light ? LucideSunMedium : LucideMoon;

    const styles = [ThemeButtonStyles.container, style] as StyleProp<TextStyle>;

    return (
        <BlackButton onPress={toggleColorSchema} style={styles} {...props}>
            <ThemeIcon color={theme.colors.white} />
        </BlackButton>
    );
};
