import { StyleSheet } from 'react-native-unistyles';

export const HistoryDifficultyStyles = StyleSheet.create(theme => ({
    chevronSlot: {
        width: 16
    },
    missingTrack: {
        borderColor: theme.colors.surface.border,
        borderStyle: 'dashed',
        borderTopWidth: 1.5,
        flex: 1
    },
    pressableRow: {
        _web: {
            cursor: 'pointer',
            _hover: { opacity: 0.7 }
        }
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        minHeight: 48,
        paddingVertical: 6,
        width: '100%'
    },
    subtitle: {
        color: theme.colors.text.hint,
        fontSize: 12,
        fontVariant: ['tabular-nums'],
        fontWeight: '600',
        lineHeight: 15,
        textAlign: 'left'
    },
    title: {
        color: theme.colors.text.primary,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: -0.2,
        lineHeight: 19,
        textAlign: 'left'
    },
    titleGroup: {
        width: 118
    },
    track: {
        backgroundColor: theme.colors.numpad.track,
        borderRadius: 5,
        flex: 1,
        height: 10,
        overflow: 'hidden'
    },
    trackFill: {
        backgroundColor: theme.colors.ink,
        borderRadius: 5,
        height: '100%'
    },
    unplayedRow: {
        opacity: 0.4
    },
    winRate: {
        color: theme.colors.text.primary,
        fontSize: 15,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        textAlign: 'right',
        width: 46
    }
}));
