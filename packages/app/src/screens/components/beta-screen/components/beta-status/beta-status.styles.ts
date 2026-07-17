import { StyleSheet } from 'react-native';

export const BetaStatusStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 16,
        justifyContent: 'center',
        minHeight: 240,
        paddingHorizontal: 20,
        width: '100%'
    },
    message: {
        fontSize: 16,
        lineHeight: 23,
        maxWidth: 440,
        textAlign: 'center'
    },
    retryButton: {
        minWidth: 160
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28,
        textAlign: 'center'
    }
});
