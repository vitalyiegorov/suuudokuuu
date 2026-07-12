import { StyleSheet } from 'react-native-unistyles';

export const SettingsOptionSheetRowStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 68,
        paddingHorizontal: 28,
        paddingVertical: 11,
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    content: {
        flex: 1,
        gap: theme.spacing.xs
    },
    description: {
        fontSize: theme.typography.size.xs,
        lineHeight: 17,
        textAlign: 'left'
    },
    selectedTitle: {
        fontWeight: '700'
    },
    title: {
        fontSize: theme.typography.size.md,
        lineHeight: 22,
        textAlign: 'left'
    }
}));
