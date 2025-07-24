import { StyleSheet } from 'react-native';

import { Colors } from '../../../@generic/styles/theme';
import {
    CellCandidateFontSizeConstant,
    CellCandidateOffsetConstant,
    CellFontSizeConstant,
    CellSizeConstant
} from '../constants/dimensions.contant';

export const FieldCellStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderColor: Colors.black,
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
        color: Colors.cell.activeText,
        fontWeight: 'bold'
    },
    textActiveValue: {
        color: Colors.cell.activeValueText
    },
    textCandidate: {
        color: Colors.cell.candidate,
        fontSize: CellCandidateFontSizeConstant,
        position: 'absolute'
    },
    textCandidatePosition1: {
        left: CellCandidateOffsetConstant,
        top: CellCandidateOffsetConstant / 2
    },
    textCandidatePosition2: {
        left: CellCandidateOffsetConstant / 2 + CellSizeConstant / 3,
        top: CellCandidateOffsetConstant / 2
    },
    textCandidatePosition3: {
        left: CellCandidateOffsetConstant / 2 + (2 * CellSizeConstant) / 3,
        top: CellCandidateOffsetConstant / 2
    },
    textCandidatePosition4: {
        left: CellCandidateOffsetConstant,
        top: CellSizeConstant / 3
    },
    textCandidatePosition5: {
        left: CellCandidateOffsetConstant / 2 + CellSizeConstant / 3,
        top: CellSizeConstant / 3
    },
    textCandidatePosition6: {
        left: CellCandidateOffsetConstant / 2 + (2 * CellSizeConstant) / 3,
        top: CellSizeConstant / 3
    },
    textCandidatePosition7: {
        left: CellCandidateOffsetConstant,
        top: -CellCandidateOffsetConstant / 2 + (CellSizeConstant / 3) * 2
    },
    textCandidatePosition8: {
        left: CellCandidateOffsetConstant / 2 + CellSizeConstant / 3,
        top: -CellCandidateOffsetConstant / 2 + (CellSizeConstant / 3) * 2
    },
    textCandidatePosition9: {
        left: CellCandidateOffsetConstant / 2 + (2 * CellSizeConstant) / 3,
        top: -CellCandidateOffsetConstant / 2 + (CellSizeConstant / 3) * 2
    },
    textEmpty: {
        color: Colors.cell.emptyValueText
    },
    textHighlighted: {
        color: Colors.cell.highlightedText
    },
    textRegular: {
        color: Colors.black,
        fontSize: CellFontSizeConstant
    }
});
