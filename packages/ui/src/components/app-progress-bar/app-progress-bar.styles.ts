import { StyleSheet } from 'react-native-unistyles';

export const AppProgressBarStyles = StyleSheet.create(theme => ({
    compact: {
        height: 6
    },
    fill: {
        borderRadius: theme.radius.pill,
        height: '100%'
    },
    regular: {
        height: 8
    },
    remainder: {
        height: '100%'
    },
    track: {
        borderRadius: theme.radius.pill,
        flexDirection: 'row',
        overflow: 'hidden',
        width: '100%'
    }
}));
