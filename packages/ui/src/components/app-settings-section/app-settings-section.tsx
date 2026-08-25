import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { MaxFontSizeMultiplierConstant } from '../../theme/constant/font-scaling.constant';

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

    return (
        <View style={sectionStyles}>
            <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={titleStyles}>
                {title}
            </Text>

            <View style={styles.rows}>{children}</View>
        </View>
    );
};
