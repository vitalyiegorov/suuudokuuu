import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../../constants/dimensions.contant';

export const AvailableValuesStyles = StyleSheet.create({
    valueWrapper: {
        borderWidth: 1,
        height: CellSizeConstant,
        width: CellSizeConstant
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        gap: 2,
        justifyContent: 'center'
    }
});
