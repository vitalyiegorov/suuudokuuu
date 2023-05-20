import { StyleSheet } from 'react-native';

import { cellSize } from '../../constants/dimensions.contant';

export const AvailableValuesStyles = StyleSheet.create({
    valueWrapper: {
        borderWidth: 1,
        height: cellSize,
        width: cellSize
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        gap: 2,
        justifyContent: 'center'
    }
});
