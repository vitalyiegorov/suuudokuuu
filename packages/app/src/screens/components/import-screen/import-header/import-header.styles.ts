import { StyleSheet } from 'react-native-unistyles';

const boardMaxWidth = 480;

export const ImportHeaderStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.md,
        maxWidth: boardMaxWidth + theme.spacing.lg * 2,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xs,
        width: '100%'
    },
    resetSlot: { width: 44, height: 44 },
    reset: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        width: 44,
        borderRadius: theme.radius.sm,
        _web: {
            cursor: 'pointer'
        }
    },
    resetPressed: {
        opacity: 0.6,
        transform: [{ scale: 0.97 }]
    },
    title: {
        flex: 1,
        marginBottom: 0,
        textAlign: 'left'
    }
}));
