import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useUiTheme } from '../../theme/hooks/use-ui-theme.hook';

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
    const { theme } = useUiTheme();
    let backgroundColor = theme.colors.candidate.bg;
    let borderColor = theme.colors.value.border;

    if (variant === 'muted') {
        backgroundColor = theme.colors.cell.highlighted;
    }

    if (variant === 'inverted') {
        backgroundColor = theme.colors.black;
        borderColor = theme.colors.black;
    }

    const cardStyles = [styles.card, styles[size], { backgroundColor, borderColor }, style];

    return (
        <View style={cardStyles} testID={testID}>
            {children}
        </View>
    );
};
