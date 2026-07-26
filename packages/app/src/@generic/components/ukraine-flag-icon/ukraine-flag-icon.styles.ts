import { StyleSheet } from 'react-native-unistyles';

export const UkraineFlagIconStyles = StyleSheet.create(theme => ({
    blueStripe: {
        backgroundColor: '#005BBB',
        height: 8,
        width: '100%'
    },
    container: {
        borderRadius: 2,
        height: 16,
        marginLeft: theme.spacing.sm,
        overflow: 'hidden',
        width: 26
    },
    yellowStripe: {
        backgroundColor: '#FFD500',
        height: 8,
        width: '100%'
    }
}));
