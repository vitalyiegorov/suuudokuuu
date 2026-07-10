import { StyleSheet } from 'react-native-unistyles';

import { PanelControlSizeConstant } from '../../constant/panel-control-size.constant';

const whiteColor = '#ffffff';

export const CandidateInputItemStyles = StyleSheet.create(() => ({
    button: {
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: PanelControlSizeConstant / 2,
        borderWidth: 2,
        height: PanelControlSizeConstant,
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0,
        overflow: 'visible',
        position: 'relative',
        width: PanelControlSizeConstant
    },
    container: {
        position: 'relative'
    },
    exhausted: {
        opacity: 0.35
    }
}));
