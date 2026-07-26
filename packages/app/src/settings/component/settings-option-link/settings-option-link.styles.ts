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
    value: {
        fontSize: 15,
        fontWeight: theme.typography.weight.bold,
        lineHeight: 22,
        maxWidth: theme.contentWidth.narrow,
        textAlign: 'right'
    }
}));
