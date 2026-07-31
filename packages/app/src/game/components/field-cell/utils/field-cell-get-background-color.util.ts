import type { FieldCellBackgroundColorParamsInterface } from '../interface/field-cell-background-color-params.interface';

export const fieldCellGetBackgroundColor = (params: FieldCellBackgroundColorParamsInterface) => {
    const { isActiveValue, isCellHighlighted, isWrong, isEmpty, showAreas, showIdenticalNumbers, showFilledNumbers, theme } = params;

    if (isWrong) {
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
