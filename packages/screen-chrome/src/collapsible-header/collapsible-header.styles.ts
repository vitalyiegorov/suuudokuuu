import { StyleSheet } from 'react-native';

export const collapsibleHeaderStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 16,
        width: '100%'
    }
});
