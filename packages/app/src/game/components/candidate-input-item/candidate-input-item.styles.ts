import { StyleSheet } from 'react-native';

import { GameNumberInputButtonSizeConstant } from '../constants/dimensions.contant';

const whiteColor = '#ffffff';

export const CandidateInputItemStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderRadius: GameNumberInputButtonSizeConstant / 2,
        borderWidth: 2,
        height: GameNumberInputButtonSizeConstant,
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0,
        overflow: 'visible',
        position: 'relative',
        width: GameNumberInputButtonSizeConstant
    },
    container: {
        position: 'relative'
    }
});
