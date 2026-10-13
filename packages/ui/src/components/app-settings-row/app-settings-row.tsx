import { Text, View } from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { MaxFontSizeMultiplierConstant } from '../../theme/constant/font-scaling.constant';

import { AppSettingsRowStyles as styles } from './app-settings-row.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly description?: string;
    readonly title: string;
    readonly trailing?: ReactNode;
}

export const AppSettingsRow = ({ description, title, trailing }: Props) => (
    <View style={styles.row}>
        <View style={styles.content}>
            <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={styles.title}>
                {title}
            </Text>

            {isNotEmptyString(description) && (
                <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={styles.description}>
                    {description}
                </Text>
            )}
        </View>

        {isDefined(trailing) && <View style={styles.trailing}>{trailing}</View>}
    </View>
);
