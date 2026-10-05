import { Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { MaxFontSizeMultiplierConstant } from '../../theme/constant/font-scaling.constant';

import { AppSettingsRowStyles as styles } from './app-settings-row.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly description?: string;
    readonly testID?: string;
    readonly title: string;
    readonly trailing?: ReactNode;
}

export const AppSettingsRow = ({ description, testID, title, trailing }: Props) => {
    const { theme } = useUnistyles();
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];
    const descriptionStyles = [styles.description, { color: theme.colors.text.hint }];

    return (
        <View style={styles.row} testID={testID}>
            <View style={styles.content}>
                <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={titleStyles}>
                    {title}
                </Text>

                {isNotEmptyString(description) && (
                    <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={descriptionStyles}>
                        {description}
                    </Text>
                )}
            </View>

            {isDefined(trailing) && <View style={styles.trailing}>{trailing}</View>}
        </View>
    );
};
