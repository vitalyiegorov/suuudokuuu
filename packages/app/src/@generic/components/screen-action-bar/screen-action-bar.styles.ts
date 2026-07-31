import { StyleSheet } from 'react-native';

import { AppIconButtonSize } from '../app-icon-button/constant/app-icon-button-size.constant';

export const ScreenActionBarStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        width: '100%'
    },
    main: {
        alignItems: 'center',
        flex: 1
    },
    side: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AppIconButtonSize
    }
});
