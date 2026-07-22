import { StyleSheet } from 'react-native';

import { BlackIconButtonSize } from '../black-icon-button/constant/black-icon-button-size.constant';

export const ScreenActionBarStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        width: '100%'
    },
    main: {
        flex: 1
    },
    side: {
        alignItems: 'center',
        justifyContent: 'center',
        width: BlackIconButtonSize
    }
});
