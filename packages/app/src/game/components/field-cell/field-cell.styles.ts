import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';

export const FieldCellStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        aspectRatio: 1,
        borderColor: Colors.black,
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        flex: 1,
        fontFamily: 'Inter_500Medium',
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0
    },
    groupXEnd: {
        borderRightWidth: 1,
        marginRight: 5
    },
    groupYEnd: {
        borderBottomWidth: 1,
        marginBottom: 5
    },
    lastCol: {
        borderRightWidth: 1
    },
    lastRow: {
        borderBottomWidth: 1
    }
});
