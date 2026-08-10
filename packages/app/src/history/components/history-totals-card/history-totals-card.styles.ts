import { StyleSheet } from 'react-native-unistyles';

export const HistoryTotalsCardStyles = StyleSheet.create(() => ({
    container: {
        gap: 12,
        width: '100%'
    },
    heroCard: {
        borderRadius: 24,
        flex: 1,
        gap: 4,
        paddingHorizontal: 18,
        paddingVertical: 18
    },
    heroLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.2,
        lineHeight: 16,
        textAlign: 'left'
    },
    heroRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%'
    },
    heroValue: {
        fontSize: 34,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -1,
        lineHeight: 40,
        textAlign: 'left'
    },
    ratingCard: {
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 14,
        width: '100%'
    },
    separator: {
        height: 26,
        marginHorizontal: 0
    },
    strip: {
        paddingHorizontal: 0,
        paddingVertical: 2,
        width: '100%'
    }
}));
