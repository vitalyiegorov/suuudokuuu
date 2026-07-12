import type { FieldCellBackgroundColorParamsInterface } from '../interface/field-cell-background-color-params.interface';

export const fieldCellGetBackgroundColor = (params: FieldCellBackgroundColorParamsInterface) => {
    const { isActiveValue, isCellHighlighted, isWrong, isEmpty, showAreas, showIdenticalNumbers, showFilledNumbers, theme } = params;

    if (isWrong) {
        return theme.colors.cell.error;
    } else if (isActiveValue && showIdenticalNumbers) {
        return theme.colors.cell.activeValue;
    } else if (isCellHighlighted && showAreas) {
        return theme.colors.cell.highlighted;
    } else if (isEmpty) {
        return theme.colors.white;
    } else if (showFilledNumbers) {
        return theme.colors.cell.filled;
    }

    return theme.colors.white;
};
