import { StyleSheet } from 'react-native';

import {
    CellCandidateHorizontalOffsetConstant,
    CellCandidateVerticalOffsetConstant,
    CellSizeConstant
} from '../constants/dimensions.contant';

export const FieldCellCandidateStyles = StyleSheet.create({
    textCandidate: {
        paddingHorizontal: CellCandidateHorizontalOffsetConstant,
        position: 'absolute'
    },
    textCandidatePosition1: {
        left: CellCandidateHorizontalOffsetConstant,
        top: CellCandidateVerticalOffsetConstant
    },
    textCandidatePosition2: {
        left: CellCandidateHorizontalOffsetConstant / 2 + CellSizeConstant / 3,
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
        left: CellCandidateHorizontalOffsetConstant / 2 + CellSizeConstant / 3,
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
        left: CellCandidateHorizontalOffsetConstant / 2 + CellSizeConstant / 3
    },
    textCandidatePosition9: {
        bottom: CellCandidateVerticalOffsetConstant,
        right: CellCandidateHorizontalOffsetConstant
    }
});

export const textCandidatePositionStyles = {
    1: FieldCellCandidateStyles.textCandidatePosition1,
    2: FieldCellCandidateStyles.textCandidatePosition2,
    3: FieldCellCandidateStyles.textCandidatePosition3,
    4: FieldCellCandidateStyles.textCandidatePosition4,
    5: FieldCellCandidateStyles.textCandidatePosition5,
    6: FieldCellCandidateStyles.textCandidatePosition6,
    7: FieldCellCandidateStyles.textCandidatePosition7,
    8: FieldCellCandidateStyles.textCandidatePosition8,
    9: FieldCellCandidateStyles.textCandidatePosition9
};
