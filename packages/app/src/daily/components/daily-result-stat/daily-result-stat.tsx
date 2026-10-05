import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { DailyResultStatStyles as styles } from './daily-result-stat.styles';

interface Props {
    readonly label: string;
    readonly testID: string;
    readonly value: string;
}

export const DailyResultStat = ({ label, testID, value }: Props) => {
    const { theme } = use(ThemeContext);

    const labelStyles = [styles.label, { color: theme.colors.text.hint }];
    const valueStyles = [styles.value, { color: theme.colors.text.primary }];

    return (
        <View style={styles.root}>
            <BlackText numberOfLines={1} style={labelStyles}>
                {label}
            </BlackText>

            <BlackText adjustsFontSizeToFit numberOfLines={1} style={valueStyles} testID={testID}>
                {value}
            </BlackText>
        </View>
    );
};
