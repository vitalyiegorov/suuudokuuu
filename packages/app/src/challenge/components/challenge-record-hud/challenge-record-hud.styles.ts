import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

export const ChallengeRecordHudStyles = StyleSheet.create((theme, rt) => ({
    container: {
        paddingHorizontal: appLayoutScreenIsWide(rt.screen) ? 0 : theme.spacing.xs,
        paddingTop: theme.spacing.xs,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs,
        minHeight: 28,
        paddingBottom: 2,
        paddingHorizontal: theme.spacing.sm,
        width: '100%'
    },
    badge: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.4,
        textTransform: 'uppercase'
    },
    badgeSlot: {
        alignItems: 'flex-end',
        flex: 1
    },
    recordDot: {
        borderRadius: 3,
        height: 6,
        width: 6
    }
}));
