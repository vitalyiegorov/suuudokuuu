import { StyleSheet } from 'react-native-unistyles';

export const SupportUkrainePillStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center',
        minHeight: 32,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 7,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    text: {
        fontSize: theme.typography.size.xs,
        fontWeight: '800',
        lineHeight: 15
    }
}));
