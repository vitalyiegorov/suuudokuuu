import { StyleSheet } from 'react-native-unistyles';

export const ChallengeRecordHudStyles = StyleSheet.create(theme => ({
    container: {
        paddingHorizontal: theme.spacing.xs,
        paddingTop: theme.spacing.xs,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs,
        paddingBottom: 2,
        width: '100%'
    },
    badge: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.4,
        textTransform: 'uppercase'
    },
    technique: {
        flex: 1,
        fontSize: 10,
        fontWeight: '700',
        textAlign: 'right'
    },
    recordDot: {
        borderRadius: 3,
        height: 6,
        width: 6
    }
}));
