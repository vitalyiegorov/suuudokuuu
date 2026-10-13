import { mixColors } from '../../../../theme/utils/mix-colors.util';

import type { FieldCellBackgroundColorParamsInterface } from '../interface/field-cell-background-color-params.interface';

const hintTintProgress = 0.28;

export const fieldCellGetBackgroundColor = (params: FieldCellBackgroundColorParamsInterface) => {
    const {
        isActive,
        isActiveValue,
        isCellHighlighted,
        isHintCell,
        isTargetCell,
        isWrong,
        isEmpty,
        showAreas,
        showIdenticalNumbers,
        showFilledNumbers,
        theme
    } = params;

    if (isTargetCell) {
        return theme.colors.accent;
    } else if (isActive) {
        return theme.colors.board.selected;
    } else if (isHintCell) {
        return mixColors(
            isEmpty || !showFilledNumbers ? theme.colors.surface.raised : theme.colors.board.filled,
            theme.colors.accent,
            hintTintProgress
        );
    } else if (isWrong) {
        return theme.colors.board.error;
    } else if (isActiveValue && showIdenticalNumbers) {
        return theme.colors.board.sameValue;
    } else if (isCellHighlighted && showAreas) {
        return theme.colors.surface.subtle;
    } else if (isEmpty) {
        return theme.colors.surface.raised;
    } else if (showFilledNumbers) {
        return theme.colors.board.filled;
    }

    return theme.colors.surface.raised;
};
