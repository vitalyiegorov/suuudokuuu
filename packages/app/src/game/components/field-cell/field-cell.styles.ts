import { StyleSheet } from 'react-native';

import {
    CellCandidateHorizontalOffsetConstant,
    CellCandidateVerticalOffsetConstant,
    CellSizeConstant
} from '../constants/dimensions.contant';

export const FieldCellStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderStyle: 'solid',
        borderTopWidth: 1,
        fontFamily: 'Inter_500Medium',
        height: CellSizeConstant,
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0,
        position: 'relative',
        width: CellSizeConstant
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
    },
    textActive: {
        fontWeight: 'bold'
    },
    textCandidate: {
        position: 'absolute'
    },
    textCandidatePosition1: {
        left: CellCandidateHorizontalOffsetConstant,
        top: CellCandidateVerticalOffsetConstant
    },
    textCandidatePosition2: {
        left: CellCandidateHorizontalOffsetConstant + CellSizeConstant / 3,
        top: CellCandidateVerticalOffsetConstant
    },
    textCandidatePosition3: {
        right: CellCandidateHorizontalOffsetConstant,
        top: CellCandidateVerticalOffsetConstant
    },
    textCandidatePosition4: {
        left: CellCandidateHorizontalOffsetConstant,
        top: CellSizeConstant / 3
    },
    textCandidatePosition5: {
        left: CellCandidateHorizontalOffsetConstant + CellSizeConstant / 3,
        top: CellSizeConstant / 3
    },
    textCandidatePosition6: {
        right: CellCandidateHorizontalOffsetConstant,
        top: CellSizeConstant / 3
    },
    textCandidatePosition7: {
        bottom: CellCandidateVerticalOffsetConstant,
        left: CellCandidateHorizontalOffsetConstant
    },
    textCandidatePosition8: {
        bottom: CellCandidateVerticalOffsetConstant,
        left: CellCandidateHorizontalOffsetConstant + CellSizeConstant / 3
    },
    textCandidatePosition9: {
        bottom: CellCandidateVerticalOffsetConstant,
        right: CellCandidateHorizontalOffsetConstant
    }
});
