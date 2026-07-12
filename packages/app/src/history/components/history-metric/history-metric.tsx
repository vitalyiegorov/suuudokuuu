import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistoryMetricStyles as styles } from './history-metric.styles';

interface Props {
    readonly label: string;
    readonly value: string;
}

export const HistoryMetric = ({ label, value }: Props) => {
    const { theme } = use(ThemeContext);

    const containerStyles = [styles.container, { borderColor: theme.colors.candidate.border }];
    const labelStyles = [styles.label, { color: theme.colors.label.hint }];
    const valueStyles = [styles.value, { color: theme.colors.label.main }];

    return (
        <View style={containerStyles}>
            <BlackText numberOfLines={1} style={labelStyles}>
                {label}
            </BlackText>
            <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1} style={valueStyles}>
                {value}
            </BlackText>
        </View>
    );
};
