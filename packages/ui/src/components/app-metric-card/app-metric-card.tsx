import { Text } from 'react-native';

import { useUiTheme } from '../../theme/hooks/use-ui-theme.hook';
import { AppSurfaceCard } from '../app-surface-card/app-surface-card';

import { AppMetricCardStyles as styles } from './app-metric-card.styles';

type AppMetricCardVariant = 'default' | 'inverted';
type AppMetricCardSize = 'compact' | 'regular';

interface Props {
    readonly label: string;
    readonly value: string;
    readonly testID: string;
    readonly size?: AppMetricCardSize;
    readonly variant?: AppMetricCardVariant;
}

export const AppMetricCard = ({ label, value, testID, size = 'regular', variant = 'default' }: Props) => {
    const { theme } = useUiTheme();
    const surfaceVariant = variant === 'inverted' ? 'inverted' : 'muted';
    const labelColor = variant === 'inverted' ? theme.colors.label.inverted : theme.colors.label.hint;
    const valueColor = variant === 'inverted' ? theme.colors.label.inverted : theme.colors.label.main;
    const cardSizeStyles = size === 'compact' ? styles.cardCompact : styles.cardRegular;
    const labelSizeStyles = size === 'compact' ? styles.labelCompact : styles.labelRegular;
    const valueSizeStyles = size === 'compact' ? styles.valueCompact : styles.valueRegular;
    const cardStyles = [styles.card, cardSizeStyles];
    const labelStyles = [styles.label, labelSizeStyles, { color: labelColor }];
    const valueStyles = [styles.value, valueSizeStyles, { color: valueColor }];

    return (
        <AppSurfaceCard size="compact" style={cardStyles} variant={surfaceVariant}>
            <Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.72} numberOfLines={1} style={labelStyles}>
                {label}
            </Text>
            <Text
                adjustsFontSizeToFit
                allowFontScaling={false}
                minimumFontScale={0.68}
                numberOfLines={1}
                style={valueStyles}
                testID={testID}
            >
                {value}
            </Text>
        </AppSurfaceCard>
    );
};
