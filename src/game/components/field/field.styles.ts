import { Platform, StyleSheet } from 'react-native';

import { isMobileScreen, isTabletScreen } from '../../../@generic';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    wrapper: {
        alignItems: 'center',
        flex: 4,
        flexDirection: 'column',
        justifyContent: isMobileScreen() || isTabletScreen() ? 'center' : 'flex-end',
        margin: 'auto',
        ...(Platform.OS === 'web' && {
            flex: 7
        })
    }
});
