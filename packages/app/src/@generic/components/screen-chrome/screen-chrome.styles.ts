import { StyleSheet } from 'react-native-unistyles';

export const ScreenChromeStyles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        position: 'relative'
    },
    content: {
        flex: 1,
        width: '100%'
    },
    footer: {
        alignItems: 'center',
        bottom: 0,
        left: 0,
        paddingBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        position: 'absolute',
        right: 0,
        zIndex: 4
    },
    header: {
        alignItems: 'center',
        left: 0,
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 4
    }
}));
