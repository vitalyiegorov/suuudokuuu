import { StyleSheet } from 'react-native-unistyles';

export const HistoryDifficultyStyles = StyleSheet.create(theme => ({
    badge: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        justifyContent: 'center',
        minWidth: 64,
        paddingHorizontal: 14,
        paddingVertical: 10
    },
    badgeText: {
        fontSize: 18,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        lineHeight: 22,
        textAlign: 'center'
    },
    chip: {
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 2,
        minWidth: 102,
        paddingHorizontal: 14,
        paddingVertical: 11
    },
    chipLabel: {
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 15,
        textAlign: 'left'
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        width: '100%'
    },
    chipValue: {
        fontSize: theme.typography.size.md,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        lineHeight: 20,
        textAlign: 'left'
    },
    container: {
        borderRadius: 30,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 17,
        paddingHorizontal: 18,
        paddingVertical: 19,
        width: '100%',
        _web: {
            cursor: 'pointer'
        }
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        width: '100%'
    },
    metricRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%'
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
        textAlign: 'left'
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        lineHeight: 39,
        textAlign: 'left'
    },
    titleGroup: {
        flex: 1,
        gap: 2
    }
}));
