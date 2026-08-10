import { StyleSheet } from 'react-native-unistyles';

import { PanelControlPillRadiusConstant } from '../constant/panel-control-size.constant';

export const DigitButtonStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: PanelControlPillRadiusConstant,
        height: '100%',
        justifyContent: 'center',
        overflow: 'visible',
        position: 'relative',
        width: '100%'
    },
    container: {
        position: 'relative'
    },
    exhausted: {
        opacity: 0.35
    }
});
