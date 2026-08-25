import { StyleSheet } from 'react-native-unistyles';

export const DailyChallengeCardStyles = StyleSheet.create(theme => ({
    action: {
        width: '100%'
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
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'space-between',
        width: '100%'
    },
    streak: {
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 18,
        textAlign: 'right'
    },
    title: {
        flexShrink: 1,
        fontSize: 17,
        fontWeight: '800',
        lineHeight: 22,
        textAlign: 'left'
    }
}));
