import { StyleSheet } from 'react-native-unistyles';

export const SettingsOptionLinkStyles = StyleSheet.create(theme => ({
    pressable: {
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    trailing: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 7
    },
    value: {
        fontFamily: theme.typography.fontFamily,
        fontSize: 15,
        letterSpacing: -0.15,
        lineHeight: 20,
        maxWidth: theme.contentWidth.narrow,
        textAlign: 'right'
    }
}));
