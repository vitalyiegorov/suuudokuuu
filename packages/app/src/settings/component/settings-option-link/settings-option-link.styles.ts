import { StyleSheet } from 'react-native-unistyles';

export const SettingsOptionLinkStyles = StyleSheet.create(theme => ({
    chevron: {
        marginLeft: 10
    },
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
        fontSize: 17,
        fontWeight: '700',
        lineHeight: 22,
        maxWidth: theme.contentWidth.narrow,
        textAlign: 'right'
    },
    valueContainer: {
        alignItems: 'center',
        flexDirection: 'row'
    }
}));
