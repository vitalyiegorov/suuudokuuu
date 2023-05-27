import { Platform, StyleSheet } from 'react-native';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    wrapper: {
        alignItems: 'center',
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        margin: 'auto',
        ...(Platform.OS === 'web' && {
            flex: 7
        })
    }
});
