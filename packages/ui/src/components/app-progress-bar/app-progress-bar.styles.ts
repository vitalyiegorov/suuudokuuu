import { StyleSheet } from 'react-native';

export const AppProgressBarStyles = StyleSheet.create({
    compact: {
        height: 6
    },
    fill: {
        borderRadius: 999,
        height: '100%'
    },
    regular: {
        height: 8
    },
    remainder: {
        height: '100%'
    },
    track: {
        borderRadius: 999,
        flexDirection: 'row',
        overflow: 'hidden',
        width: '100%'
    }
});
