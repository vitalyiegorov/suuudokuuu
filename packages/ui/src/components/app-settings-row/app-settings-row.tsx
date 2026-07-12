import { type StyleProp, Text, View, type ViewStyle } from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { useUiTheme } from '../../theme/hooks/use-ui-theme.hook';

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
    const { theme } = useUiTheme();
    const rowStyles = [
        styles.row,
        {
            backgroundColor: theme.colors.cell.highlighted,
            borderColor: theme.colors.value.border
        },
        style
    ];
    const titleStyles = [styles.title, { color: theme.colors.label.main }];
    const descriptionStyles = [styles.description, { color: theme.colors.label.hint }];
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
