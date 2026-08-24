import { useEffect, useRef } from 'react';

import { isDefined } from '@rnw-community/shared';

import { ENTRY_FIRST_CELL_INDEX, ENTRY_GRID_INDEXES, ENTRY_GRID_SIZE } from '../../constants/puzzle-entry.constant';
import { moveEntrySelection } from '../../utils/move-entry-selection.util';
import { readEntryKey } from '../../utils/read-entry-key.util';
import { SolverEntryCell } from '../solver-entry-cell/solver-entry-cell';

import type { KeyboardEvent } from 'react';

interface Props {
    entry: string;
    selectedIndex: number | null;
    onSelect: (index: number) => void;
    onEnterValue: (character: string) => void;
}

export const SolverEntryBoard = ({ entry, onEnterValue, onSelect, selectedIndex }: Props) => {
    const selectedCellRef = useRef<HTMLButtonElement>(null);
    const isKeyboardNavigationRef = useRef(false);
    const focusableIndex = selectedIndex ?? ENTRY_FIRST_CELL_INDEX;

    useEffect(() => {
        if (isKeyboardNavigationRef.current) {
            isKeyboardNavigationRef.current = false;
            selectedCellRef.current?.focus();
        }
    }, [selectedIndex]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const nextIndex = moveEntrySelection(focusableIndex, event.key);
        const character = readEntryKey(event.key);

        if (!isDefined(nextIndex) && !isDefined(character)) {
            return;
        }

        event.preventDefault();
        isKeyboardNavigationRef.current = true;

        if (isDefined(nextIndex)) {
            onSelect(nextIndex);
        } else if (isDefined(character)) {
            onEnterValue(character);
        }
    };

    return (
        <div aria-label="Sudoku puzzle entry grid" className="solver-entry__board" onKeyDown={handleKeyDown} role="grid">
            {ENTRY_GRID_INDEXES.map(row => (
                <div className="solver-entry__row" key={row} role="row">
                    {ENTRY_GRID_INDEXES.map(column => {
                        const index = row * ENTRY_GRID_SIZE + column;
                        const isSelected = index === selectedIndex;
                        const cellRef = isSelected ? selectedCellRef : null;

                        return (
                            <SolverEntryCell
                                index={index}
                                isFocusable={index === focusableIndex}
                                isSelected={isSelected}
                                key={index}
                                onSelect={onSelect}
                                ref={cellRef}
                                value={entry[index]}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
