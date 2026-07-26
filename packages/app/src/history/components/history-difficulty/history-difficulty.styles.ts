import { StyleSheet } from 'react-native-unistyles';

export const HistoryDifficultyStyles = StyleSheet.create(theme => ({
    container: {
        borderRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 16,
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: { opacity: 0.85 }
        }
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'space-between',
        width: '100%'
    },
    separator: {
        height: 26,
        marginHorizontal: 0
    },
    strip: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: '100%'
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 17,
        textAlign: 'left'
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
        lineHeight: 26,
        textAlign: 'left'
    },
    titleGroup: {
        flex: 1,
        gap: 2
    }
}));
