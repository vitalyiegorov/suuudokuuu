import { Platform, StyleSheet } from 'react-native';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    wrapper: {
        alignItems: 'center',
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        ...(Platform.OS === 'web' && {
            flex: 7
        })
    }
});
