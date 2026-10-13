import { Text, View } from 'react-native';

import { MaxFontSizeMultiplierConstant } from '../../theme/constant/font-scaling.constant';
import { interleaveChildren } from '../../utils/interleave-children.util';

import { AppSettingsSectionStyles as styles } from './app-settings-section.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly title: string;
}

export const AppSettingsSection = ({ children, title }: Props) => (
    <View style={styles.section}>
        <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={styles.title}>
            {title}
        </Text>

        <View style={styles.group}>{interleaveChildren(children, <View style={styles.divider} />)}</View>
    </View>
);
