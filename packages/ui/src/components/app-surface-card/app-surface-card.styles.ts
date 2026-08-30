import { StyleSheet } from 'react-native-unistyles';

export const AppSurfaceCardStyles = StyleSheet.create(theme => ({
    card: {
        borderCurve: 'continuous',
        borderWidth: 1,
        overflow: 'hidden',
        width: '100%'
    },
    compact: {
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 14
    },
    regular: {
        borderRadius: 22,
        paddingHorizontal: 18,
        paddingVertical: 18
    },
    spacious: {
        borderRadius: theme.radius.lg,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.lg
    }
}));
