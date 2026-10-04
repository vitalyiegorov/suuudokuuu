import { type StyleProp, Text, type TextStyle, type ViewStyle } from 'react-native';

import { CompactMaxFontSizeMultiplierConstant, MetricMinimumFontScaleConstant } from '../../theme/constant/font-scaling.constant';
import { AppMetricStripItem } from '../app-metric-strip-item/app-metric-strip-item';
import { AppMetricStripItemStyles as styles } from '../app-metric-strip-item/app-metric-strip-item.styles';
import { useAppMetricStripColor } from '../app-metric-strip/hooks/use-app-metric-strip-color.hook';

interface Props {
    readonly label: string;
    readonly labelStyle?: StyleProp<TextStyle>;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly value: string;
    readonly valueStyle?: StyleProp<TextStyle>;
}

export const AppMetricStripValueItem = ({ label, labelStyle, style, testID, value, valueStyle }: Props) => {
    const { textColor } = useAppMetricStripColor();
    const valueStyles = [styles.value, valueStyle, { color: textColor }];

    return (
        <AppMetricStripItem label={label} labelStyle={labelStyle} style={style}>
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
        </AppMetricStripItem>
    );
};
