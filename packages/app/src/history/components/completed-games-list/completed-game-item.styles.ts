import { StyleSheet } from 'react-native';

export const CompletedGameItemStyles = StyleSheet.create({
    container: {
        borderRadius: 22,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        width: '100%'
    },
    difficulty: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 27,
        textAlign: 'left'
    },
    eyebrow: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'left'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        width: '100%'
    },
    metrics: {
        flexDirection: 'row',
        gap: 8,
        width: '100%'
    },
    replayButton: {
        borderRadius: 999,
        flexDirection: 'row',
        gap: 6,
        minHeight: 42,
        paddingHorizontal: 14,
        paddingVertical: 9
    },
    replayText: {
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 18
    },
    titleGroup: {
        flex: 1,
        gap: 2
    }
});
