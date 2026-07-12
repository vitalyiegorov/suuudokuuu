import { StyleSheet } from 'react-native';

export const HistoryTotalsCardStyles = StyleSheet.create({
    container: {
        gap: 16,
        width: '100%'
    },
    detail: {
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        flex: 1,
        gap: 4,
        justifyContent: 'center',
        minHeight: 92,
        paddingHorizontal: 10,
        paddingVertical: 14
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 18,
        opacity: 0.64,
        textAlign: 'center'
    },
    detailRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%'
    },
    detailValue: {
        fontSize: 30,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        lineHeight: 35,
        textAlign: 'center'
    },
    heroCard: {
        borderRadius: 28,
        flex: 1,
        gap: 18,
        minHeight: 118,
        paddingHorizontal: 18,
        paddingVertical: 22
    },
    heroLabel: {
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 19,
        opacity: 0.64,
        textAlign: 'left'
    },
    heroRow: {
        flexDirection: 'row',
        gap: 14,
        width: '100%'
    },
    heroValue: {
        fontSize: 34,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        lineHeight: 39,
        textAlign: 'left'
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
        opacity: 0.64,
        textAlign: 'left'
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        lineHeight: 48,
        textAlign: 'left'
    },
    titleGroup: {
        gap: 2,
        paddingBottom: 12
    }
});
