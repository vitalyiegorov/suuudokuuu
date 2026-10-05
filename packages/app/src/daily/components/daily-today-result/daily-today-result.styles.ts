import { StyleSheet } from 'react-native-unistyles';

const TickSize = 22;

export const DailyTodayResultStyles = StyleSheet.create(theme => ({
    root: {
        gap: theme.spacing.md,
        paddingBottom: 16,
        paddingHorizontal: 16,
        paddingTop: 14
    },
    tick: {
        alignItems: 'center',
        borderRadius: TickSize / 2,
        height: TickSize,
        justifyContent: 'center',
        width: TickSize
    },
    title: {
        flexShrink: 1,
        fontSize: 15.5,
        fontWeight: '700',
        lineHeight: 20,
        textAlign: 'left'
    },
    titleRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm
    }
}));
