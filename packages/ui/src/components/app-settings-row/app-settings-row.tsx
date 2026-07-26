import { type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { AppSettingsRowStyles as styles } from './app-settings-row.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly description?: string;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly title: string;
    readonly trailing?: ReactNode;
}

export const AppSettingsRow = ({ description, style, testID, title, trailing }: Props) => {
    const { theme } = useUnistyles();
    const rowStyles = [
        styles.row,
        {
            backgroundColor: theme.colors.surface.subtle,
            borderColor: theme.colors.value.border
        },
        style
    ];
    const titleStyles = [styles.title, { color: theme.colors.surface.subtleText }];
    const descriptionStyles = [styles.description, { color: theme.colors.surface.subtleHint }];
    const hasDescription = isNotEmptyString(description);

    return (
        <View style={rowStyles} testID={testID}>
            <View style={styles.content}>
                <Text allowFontScaling={false} numberOfLines={2} style={titleStyles}>
                    {title}
                </Text>

                {hasDescription && (
                    <Text allowFontScaling={false} numberOfLines={2} style={descriptionStyles}>
                        {description}
                    </Text>
                )}
            </View>

            {isDefined(trailing) && <View style={styles.trailing}>{trailing}</View>}
        </View>
    );
};
