import { StyleSheet } from 'react-native-unistyles';

import { PanelControlSizeConstant } from '../../constant/panel-control-size.constant';

export const InputModeButtonStyles = StyleSheet.create(() => ({
    button: {
        borderRadius: PanelControlSizeConstant / 2,
        height: PanelControlSizeConstant,
        width: PanelControlSizeConstant
    }
}));
