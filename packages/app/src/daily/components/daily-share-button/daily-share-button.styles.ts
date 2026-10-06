import { StyleSheet } from 'react-native-unistyles';

const ShareButtonSize = 40;

export const DailyShareButtonStyles = StyleSheet.create(() => ({
    button: {
        borderRadius: ShareButtonSize / 2,
        height: ShareButtonSize,
        minHeight: ShareButtonSize,
        paddingHorizontal: 0,
        width: ShareButtonSize
    }
}));
