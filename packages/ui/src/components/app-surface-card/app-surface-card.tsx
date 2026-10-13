import { type StyleProp, View, type ViewStyle } from 'react-native';

import { AppSurfaceCardStyles as styles } from './app-surface-card.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly size?: 'compact' | 'spacious';
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly variant?: 'default' | 'muted' | 'inverted';
}

export const AppSurfaceCard = ({ children, size = 'compact', style, testID, variant = 'default' }: Props) => {
    styles.useVariants({ size, ...(variant !== 'default' && { variant }) });
    const cardStyles = [styles.card, style];

    return (
        <View style={cardStyles} testID={testID}>
            {children}
        </View>
    );
};
