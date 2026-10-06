import { StyleSheet } from 'react-native-unistyles';

export const DailyTodaySummaryStyles = StyleSheet.create(theme => ({
    chip: {
        alignItems: 'center',
        borderRadius: 13,
        flexDirection: 'row',
        gap: 6,
        height: 26,
        paddingHorizontal: 10
    },
    chipText: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 16
    },
    date: {
        fontSize: 15.5,
        fontWeight: '600',
        lineHeight: 20,
        textAlign: 'left'
    },
    eyebrow: {
        fontSize: 11.5,
        fontWeight: '800',
        letterSpacing: 1.1,
        lineHeight: 14,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    root: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        paddingBottom: 14,
        paddingHorizontal: 16,
        paddingTop: 13
    },
    titles: {
        flexShrink: 1,
        gap: 2
    }
}));
