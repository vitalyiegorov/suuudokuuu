import { StyleSheet } from 'react-native-unistyles';

export const HistoryDifficultyStyles = StyleSheet.create(theme => ({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'space-between',
        paddingVertical: 14,
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: { opacity: 0.7 }
        }
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 17,
        textAlign: 'left'
    },
    title: {
        fontSize: 19,
        fontWeight: '800',
        letterSpacing: -0.4,
        lineHeight: 23,
        textAlign: 'left'
    },
    titleGroup: {
        flex: 1,
        gap: 2
    },
    trailing: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6
    },
    winRate: {
        fontSize: 16,
        fontVariant: ['tabular-nums'],
        fontWeight: '800'
    }
}));
