import { Fragment } from 'react';
import { type StyleProp, Text, type TextStyle, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { isDefined } from '@rnw-community/shared';

import { AppMetricStripStyles as styles } from './app-metric-strip.styles';

import type { AppMetricStripItemInterface } from './interface/app-metric-strip-item.interface';

type AppMetricStripVariant = 'primary' | 'secondary';

interface Props {
    readonly autoShrinkText?: boolean;
    readonly itemStyle?: StyleProp<ViewStyle>;
    readonly items: readonly AppMetricStripItemInterface[];
    readonly labelStyle?: StyleProp<TextStyle>;
    readonly separatorStyle?: StyleProp<ViewStyle>;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly valueStyle?: StyleProp<TextStyle>;
    readonly variant?: AppMetricStripVariant;
}

export const AppMetricStrip = (props: Props) => {
    const { autoShrinkText = true, itemStyle, items, labelStyle, separatorStyle, style, testID, valueStyle, variant = 'primary' } = props;
    const { theme } = useUnistyles();
    const isSecondaryVariant = variant === 'secondary';
    const backgroundColor = isSecondaryVariant ? theme.colors.cell.highlighted : theme.colors.black;
    const borderColor = isSecondaryVariant ? theme.colors.value.border : theme.colors.black;
    const textColor = isSecondaryVariant ? theme.colors.label.main : theme.colors.label.inverted;
    const separatorColor = isSecondaryVariant ? theme.colors.value.border : theme.colors.white05;
    const stripStyles = [
        styles.strip,
        {
            backgroundColor,
            borderColor
        },
        style
    ];
    const labelStyles = [styles.label, { color: textColor }, labelStyle];
    const shrinkProps = { ...(autoShrinkText && { adjustsFontSizeToFit: true, minimumFontScale: 0.74 }) };
    const separatorStyles = [styles.separator, { backgroundColor: separatorColor }, separatorStyle];

    return (
        <View style={stripStyles} testID={testID}>
            {items.map((item, index) => {
                const valueColor = item.valueColor ?? textColor;
                const baseItemStyles = isDefined(item.width) ? [styles.item, { width: item.width }] : styles.item;
                const itemStyles = [baseItemStyles, itemStyle];
                const valueStyles = [styles.value, { color: valueColor }, valueStyle];
                const hasSeparator = index < items.length - 1;

                return (
                    <Fragment key={item.label}>
                        <View style={itemStyles}>
                            <Text allowFontScaling={false} numberOfLines={1} style={labelStyles} {...shrinkProps}>
                                {item.label}
                            </Text>
                            {isDefined(item.valueContent) ? (
                                item.valueContent
                            ) : (
                                <Text allowFontScaling={false} numberOfLines={1} style={valueStyles} testID={item.testID} {...shrinkProps}>
                                    {item.value}
                                </Text>
                            )}
                        </View>

                        {hasSeparator && <View style={separatorStyles} />}
                    </Fragment>
                );
            })}
        </View>
    );
};
