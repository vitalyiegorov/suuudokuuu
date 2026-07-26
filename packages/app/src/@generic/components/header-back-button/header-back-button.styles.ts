import { StyleSheet } from 'react-native-unistyles';

import { HeaderBackButtonGlyphOpticalInset, HeaderBackButtonSize } from './constant/header-back-button.constant';

export const HeaderBackButtonStyles = StyleSheet.create(() => ({
    container: {
        alignItems: 'flex-start',
        height: HeaderBackButtonSize,
        justifyContent: 'center',
        marginLeft: -HeaderBackButtonGlyphOpticalInset,
        transform: [{ translateY: 2 }],
        width: HeaderBackButtonSize,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    }
}));
