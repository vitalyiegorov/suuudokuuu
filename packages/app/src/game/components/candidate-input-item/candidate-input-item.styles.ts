import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../constants/dimensions.contant';

const buttonSize = CellSizeConstant * 1.3;
const whiteColor = '#ffffff';

export const CandidateInputItemStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: whiteColor,
        borderWidth: 2,
        height: buttonSize,
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0,
        width: buttonSize
    },
    container: {
        position: 'relative'
    }
});
