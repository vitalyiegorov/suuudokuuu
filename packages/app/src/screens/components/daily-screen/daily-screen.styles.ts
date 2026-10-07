import { StyleSheet } from 'react-native-unistyles';

const ScreenHorizontalPadding = 20;

export const DailyScreenStyles = StyleSheet.create(theme => ({
    actionButton: {
        borderRadius: theme.radius.pill,
        minHeight: 56,
        width: '100%'
    },
    scrollContent: {
        alignItems: 'stretch',
        alignSelf: 'center',
        gap: theme.spacing.lg,
        maxWidth: theme.contentWidth.standard,
        paddingBottom: 28,
        paddingHorizontal: ScreenHorizontalPadding,
        width: '100%'
    },
    scrollView: {
        flex: 1,
        width: '100%'
    },
    title: {
        flexShrink: 1,
        fontSize: 32,
        letterSpacing: -0.7,
        lineHeight: 38,
        marginBottom: 0,
        minWidth: 0,
        textAlign: 'left'
    },
    todayAction: {
        paddingBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md
    },
    titleRow: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        width: '100%'
    }
}));
