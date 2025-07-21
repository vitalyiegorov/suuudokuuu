import { StyleSheet } from 'react-native';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1
    },
    wrapper: {
        alignItems: 'center',
        aspectRatio: 1,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        margin: 'auto',
        maxHeight: '60%',
        maxWidth: '90%',
        zIndex: 99
    }
});
