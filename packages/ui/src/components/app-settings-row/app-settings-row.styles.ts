import { StyleSheet } from 'react-native-unistyles';

export const AppSettingsRowStyles = StyleSheet.create(theme => ({
    content: {
        flex: 1,
        gap: 2,
        minWidth: 0
    },
    description: {
        color: theme.colors.text.hint,
        fontFamily: theme.typography.fontFamily,
        fontSize: 13,
        lineHeight: 17
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        minHeight: 58,
        paddingStart: 16,
        paddingEnd: 14,
        paddingVertical: 11,
        width: '100%'
    },
    title: {
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily,
        fontSize: 16,
        letterSpacing: -0.19,
        lineHeight: 21
    },
    trailing: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        justifyContent: 'center'
    }
}));
