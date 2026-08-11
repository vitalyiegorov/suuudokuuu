'use client';

import { BLANK_CELL_VALUE } from '../../constants/field-grid.constant';
import { FieldCellCandidates } from '../field-cell-candidates/field-cell-candidates';

import type { FieldCellViewInterface } from '../../interfaces/field-cell-view.interface';
import type { FieldCellType } from '../../types/field-cell.type';
import type { Ref } from 'react';

interface Props {
    view: FieldCellViewInterface;
    label: string;
    isFocusable: boolean;
    onSelect: (cell: FieldCellType) => void;
    ref?: Ref<HTMLButtonElement>;
}

export const FieldCell = ({ isFocusable, label, onSelect, ref, view }: Props) => {
    const isPlacedValue = view.placedValue !== BLANK_CELL_VALUE;
    const displayValue = isPlacedValue ? view.placedValue : view.value;
    const tabIndex = isFocusable ? 0 : -1;
    const cellValue = (
        <span className="field-cell__value" data-placed={isPlacedValue}>
            {displayValue}
        </span>
    );
    const cellCandidates = <FieldCellCandidates candidates={view.candidates} eliminatedCandidates={view.eliminatedCandidates} />;
    const content = displayValue === BLANK_CELL_VALUE ? cellCandidates : cellValue;

    const handleClick = () => {
        onSelect(view.cell);
    };

    return (
        <button
            aria-label={label}
            aria-selected={view.isSelected}
            className="field-cell"
            data-given={view.isGiven}
            data-highlighted={view.isHighlighted}
            data-pattern={view.isPatternCell}
            data-same-value={view.isSameValue}
            data-selected={view.isSelected}
            data-target={view.isTargetCell}
            data-wrong={view.isWrong}
            onClick={handleClick}
            ref={ref}
            role="gridcell"
            tabIndex={tabIndex}
            type="button"
        >
            {content}
        </button>
    );
};
