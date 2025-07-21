import { StyleSheet } from 'react-native';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1
    },
    wrapper: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        zIndex: 99,
        flex: 1,
        aspectRatio: 1,
        maxWidth: '90%',
        maxHeight: '60%'
    }
});
