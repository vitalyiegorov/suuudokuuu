import { StyleSheet } from 'react-native-unistyles';

export const HeaderBackButtonStyles = StyleSheet.create(() => ({
    container: {
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
        transform: [{ translateY: 2 }],
        width: 44,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    }
}));
