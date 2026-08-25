import { formatCellLabel } from '../../../techniques/utils/format-cell-label.util';
import { ENTRY_BLANK_CHARACTER, ENTRY_GRID_SIZE } from '../../constants/puzzle-entry.constant';

import type { Ref } from 'react';

interface Props {
    index: number;
    value: string;
    isSelected: boolean;
    isFocusable: boolean;
    onSelect: (index: number) => void;
    ref?: Ref<HTMLButtonElement>;
}

export const SolverEntryCell = ({ index, isFocusable, isSelected, onSelect, ref, value }: Props) => {
    const isBlank = value === ENTRY_BLANK_CHARACTER;
    const cellLabel = formatCellLabel({ x: index % ENTRY_GRID_SIZE, y: Math.floor(index / ENTRY_GRID_SIZE) });
    const label = isBlank ? `${cellLabel}, empty` : `${cellLabel}, ${value}`;
    const tabIndex = isFocusable ? 0 : -1;
    const content = isBlank ? null : value;

    const handleClick = () => {
        onSelect(index);
    };

    return (
        <button
            aria-label={label}
            aria-selected={isSelected}
            className="solver-entry__cell"
            data-selected={isSelected}
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
