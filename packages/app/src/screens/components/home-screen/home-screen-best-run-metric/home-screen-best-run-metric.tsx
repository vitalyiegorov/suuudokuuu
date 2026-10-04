import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenStyles as styles } from '../home-screen.styles';

interface Props {
    readonly label: string;
    readonly testID?: string;
    readonly value: string;
}

export const HomeScreenBestRunMetric = ({ label, testID, value }: Props) => {
    const { theme } = use(ThemeContext);
    const hintTextStyles = [styles.hintText, { color: theme.colors.text.hint }];
    const valueStyles = [styles.historyValue, { color: theme.colors.text.primary }];

    return (
        <View style={styles.bestRunMetric}>
            <BlackText style={hintTextStyles}>{label}</BlackText>
            <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1} style={valueStyles} testID={testID}>
                {value}
            </BlackText>
        </View>
    );
};
