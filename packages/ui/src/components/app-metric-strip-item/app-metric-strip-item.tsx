import { type StyleProp, Text, type TextStyle, View, type ViewStyle } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { CompactMaxFontSizeMultiplierConstant, MetricMinimumFontScaleConstant } from '../../theme/constant/font-scaling.constant';
import { useAppMetricStripColor } from '../app-metric-strip/hooks/use-app-metric-strip-color.hook';

import { AppMetricStripItemStyles as styles } from './app-metric-strip-item.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children?: ReactNode;
    readonly label: string;
    readonly labelStyle?: StyleProp<TextStyle>;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly value?: string;
    readonly valueStyle?: StyleProp<TextStyle>;
}

export const AppMetricStripItem = ({ children, label, labelStyle, style, testID, value, valueStyle }: Props) => {
    const { textColor } = useAppMetricStripColor();
    const itemStyles = [styles.item, style];
    const labelStyles = [styles.label, labelStyle, { color: textColor }];
    const valueStyles = [styles.value, valueStyle, { color: textColor }];
    const hasChildren = isDefined(children);

    return (
        <View style={itemStyles}>
            <Text
                adjustsFontSizeToFit
                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                minimumFontScale={MetricMinimumFontScaleConstant}
                numberOfLines={1}
                style={labelStyles}
            >
                {label}
            </Text>

            {hasChildren ? (
                children
            ) : (
                <Text
                    adjustsFontSizeToFit
                    maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                    minimumFontScale={MetricMinimumFontScaleConstant}
                    numberOfLines={1}
                    style={valueStyles}
                    testID={testID}
                >
                    {value}
                </Text>
            )}
        </View>
    );
};
