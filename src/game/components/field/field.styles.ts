import { Platform, StyleSheet } from 'react-native';

import { isMobileScreen } from '../../constants/dimensions.contant';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    wrapper: {
        alignItems: 'center',
        flex: 5,
        flexDirection: 'column',
        justifyContent: isMobileScreen() ? 'center' : 'flex-end',
        margin: 'auto',
        ...(Platform.OS === 'web' && {
            flex: 7
        })
    }
});
