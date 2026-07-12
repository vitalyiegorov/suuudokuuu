import { StyleSheet } from 'react-native';

export const AppSurfaceCardStyles = StyleSheet.create({
    card: {
        borderCurve: 'continuous',
        borderWidth: StyleSheet.hairlineWidth,
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
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 20
    }
});
