import { StyleSheet } from 'react-native-unistyles';

export const AppProgressBarStyles = StyleSheet.create(theme => ({
    fill: {
        backgroundColor: theme.colors.inkText,
        borderRadius: theme.radius.pill,
        height: '100%'
    },
    remainder: {
        height: '100%'
    },
    track: {
        backgroundColor: theme.colors.overlayDark,
        height: 6,
        borderRadius: theme.radius.pill,
        flexDirection: 'row',
        overflow: 'hidden',
        width: '100%'
    }
}));
