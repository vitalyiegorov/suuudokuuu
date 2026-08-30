import { StyleSheet } from 'react-native-unistyles';

export const DailyHistoryListStyles = StyleSheet.create(theme => ({
    difficulty: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 18,
        textAlign: 'right'
    },
    empty: {
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'left'
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.2,
        lineHeight: 16,
        marginBottom: theme.spacing.xs,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    item: {
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'space-between',
        minHeight: 44,
        width: '100%'
    },
    itemDate: {
        flexShrink: 1,
        fontSize: 15,
        lineHeight: 20,
        textAlign: 'left'
    },
    list: {
        gap: 0,
        width: '100%'
    }
}));
