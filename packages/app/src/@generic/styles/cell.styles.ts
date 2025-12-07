import { StyleSheet } from 'react-native';

import { CellSizeConstant } from '../../game/components/constants/dimensions.contant';

export const CellStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        fontFamily: 'Inter_500Medium',
        height: CellSizeConstant,
        justifyContent: 'center',
        position: 'relative',
        width: CellSizeConstant,
        outlineOffset: 0,
        outlineWidth: 0
    }
});
