import type { FieldCellBackgroundColorParamsInterface } from '../interface/field-cell-background-color-params.interface';

export const fieldCellGetBackgroundColor = (params: FieldCellBackgroundColorParamsInterface) => {
    const {
        isActive,
        isActiveValue,
        isCellHighlighted,
        isPatternCell,
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
    } else if (isPatternCell) {
        return theme.colors.candidate.fillSelected;
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
