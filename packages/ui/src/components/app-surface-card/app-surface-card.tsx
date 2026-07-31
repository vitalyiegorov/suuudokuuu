import { type StyleProp, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { AppSurfaceCardStyles as styles } from './app-surface-card.styles';

import type { ReactNode } from 'react';

type AppSurfaceCardSize = 'compact' | 'regular' | 'spacious';
type AppSurfaceCardVariant = 'default' | 'muted' | 'inverted';

interface Props {
    readonly children: ReactNode;
    readonly size?: AppSurfaceCardSize;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly variant?: AppSurfaceCardVariant;
}

export const AppSurfaceCard = ({ children, size = 'regular', style, testID, variant = 'default' }: Props) => {
    const { theme } = useUnistyles();
    let backgroundColor = theme.colors.candidate.fill;
    let borderColor = theme.colors.surface.border;

    if (variant === 'muted') {
        backgroundColor = theme.colors.surface.subtle;
    }

    if (variant === 'inverted') {
        backgroundColor = theme.colors.ink;
        borderColor = theme.colors.ink;
    }

    const cardStyles = [styles.card, styles[size], { backgroundColor, borderColor }, style];

    return (
        <View style={cardStyles} testID={testID}>
            {children}
        </View>
    );
};
