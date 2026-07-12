import { FieldCellSelectors as selectors } from '../field-cell.selectors';

export const fieldCellGetSelector = (isActive: boolean, isActiveValue: boolean, isHighlighted: boolean): selectors => {
    if (isActive) {
        return selectors.Active;
    } else if (isActiveValue) {
        return selectors.ActiveValue;
    } else if (isHighlighted) {
        return selectors.Highlighted;
    }

    return selectors.Root;
};
