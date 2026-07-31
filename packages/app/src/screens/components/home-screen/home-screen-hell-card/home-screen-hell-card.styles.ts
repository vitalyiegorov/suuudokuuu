import { StyleSheet } from 'react-native-unistyles';

export const HomeScreenHellCardStyles = StyleSheet.create(theme => ({
    badge: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm
    },
    badgeText: {
        fontSize: theme.typography.size.sm,
        fontWeight: '800',
        textAlign: 'center'
    },
    card: {
        alignItems: 'center',
        borderRadius: theme.radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        minHeight: 60,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    container: {
        width: '100%'
    },
    title: {
        fontSize: theme.typography.size.lg,
        fontWeight: '800',
        letterSpacing: 0.4,
        textAlign: 'left',
        textTransform: 'uppercase'
    }
}));
