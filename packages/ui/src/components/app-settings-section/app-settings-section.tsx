import { Children } from 'react';
import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { MaxFontSizeMultiplierConstant } from '../../theme/constant/font-scaling.constant';
import { getSeparatorKey } from '../../utils/get-separator-key.util';

import { AppSettingsSectionStyles as styles } from './app-settings-section.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly style?: StyleProp<ViewStyle>;
    readonly title: string;
}

export const AppSettingsSection = ({ children, style, title }: Props) => {
    const { theme } = useUnistyles();
    const sectionStyles = [styles.section, style];
    const titleStyles = [styles.title, { color: theme.colors.text.hint }];
    const groupStyles = [styles.group, { backgroundColor: theme.colors.surface.group, borderColor: theme.colors.surface.border }];
    const dividerStyles = [styles.divider, { backgroundColor: theme.colors.surface.border }];
    const rowsWithDividers = Children.toArray(children).flatMap((row, index) => {
        if (index === 0) {
            return [row];
        }

        return [<View key={getSeparatorKey(row, index)} style={dividerStyles} />, row];
    });

    return (
        <View style={sectionStyles}>
            <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={titleStyles}>
                {title}
            </Text>

            <View style={groupStyles}>{rowsWithDividers}</View>
        </View>
    );
};
