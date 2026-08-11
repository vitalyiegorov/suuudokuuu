import { StyleSheet } from 'react-native-unistyles';

export const HomeScreenComfortOfferStyles = StyleSheet.create(theme => ({
    actions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        width: '100%'
    },
    action: {
        flex: 1
    },
    content: {
        gap: theme.spacing.sm,
        width: '100%'
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'left'
    },
    title: {
        fontSize: 17,
        fontWeight: '800',
        lineHeight: 22,
        textAlign: 'left'
    }
}));
