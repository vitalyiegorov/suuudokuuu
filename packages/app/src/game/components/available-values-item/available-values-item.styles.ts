import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../constants/dimensions.contant';

const progressHeight = 2;
const buttonSize = CellSizeConstant * 1.3;

export const AvailableValuesItemStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderBottomWidth: progressHeight,
        borderWidth: 1,
        height: buttonSize,
        justifyContent: 'center',
        width: buttonSize
    },
    container: {
        position: 'relative'
    },
    progress: {
        height: progressHeight,
        left: 0,
        position: 'absolute',
        top: buttonSize - progressHeight
    }
});
