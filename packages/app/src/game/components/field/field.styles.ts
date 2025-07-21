import { StyleSheet } from 'react-native';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1
    },
    wrapper: {
        alignItems: 'center',
        aspectRatio: 9 / 10,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        maxHeight: '75%',
        maxWidth: '95%',
        width: '90%',
        zIndex: 99
    }
});
