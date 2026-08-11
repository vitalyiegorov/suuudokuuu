'use client';

import { getCellKey } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { useEffect, useRef } from 'react';

import { isDefined } from '@rnw-community/shared';

import { FIRST_CELL_KEY } from '../../constants/field-grid.constant';
import { buildFieldCellView } from '../../utils/build-field-cell-view.util';
import { buildFieldStepState } from '../../utils/build-field-step-state.util';
import { getFieldCellCandidates } from '../../utils/get-field-cell-candidates.util';
import { getFieldClassName } from '../../utils/get-field-class-name.util';
import { getKeyDigit } from '../../utils/get-key-digit.util';
import { getKeyDirection } from '../../utils/get-key-direction.util';
import { FieldCell } from '../field-cell/field-cell';

import type { FieldBoardLabelsInterface } from '../../interfaces/field-board-labels.interface';
import type { FieldCellViewContextInterface } from '../../interfaces/field-cell-view-context.interface';
import type { FieldCellType } from '../../types/field-cell.type';
import type { FieldEngine } from '@suuudokuuu/field-core';
import type { KeyboardEvent } from 'react';

const EMPTY_GIVEN_CELL_KEYS: ReadonlySet<string> = new Set<string>();
const INPUT_MODE_KEY = 'n';

interface Props {
    engine: FieldEngine;
    labels: FieldBoardLabelsInterface;
    givenCellKeys?: ReadonlySet<string>;
    mistakeCell?: FieldCellType;
    className?: string;
}

export const FieldBoard = ({ className, engine, givenCellKeys = EMPTY_GIVEN_CELL_KEYS, labels, mistakeCell }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const selectedCellRef = useRef<HTMLButtonElement>(null);
    const isKeyboardDrivenRef = useRef(false);

    const { selectedCell } = snapshot;
    const selectedCellKey = isDefined(selectedCell) ? getCellKey(selectedCell) : null;
    const focusableCellKey = selectedCellKey ?? FIRST_CELL_KEY;
    const context: FieldCellViewContextInterface = {
        givenCellKeys,
        stepState: buildFieldStepState(snapshot.stepScript, snapshot.stepIndex),
        ...(isDefined(selectedCell) && { selectedCell }),
        ...(isDefined(mistakeCell) && { mistakeCell })
    };

    useEffect(() => {
        if (isKeyboardDrivenRef.current) {
            selectedCellRef.current?.focus();
        }
    }, [selectedCellKey]);

    const handleSelect = (cell: FieldCellType) => {
        isKeyboardDrivenRef.current = false;
        engine.selectCell(cell);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const direction = getKeyDirection(event.key);
        const digit = getKeyDigit(event.key);
        const isInputModeKey = event.key.toLowerCase() === INPUT_MODE_KEY;

        if (!isDefined(direction) && !isDefined(digit) && !isInputModeKey) {
            return;
        }

        event.preventDefault();
        isKeyboardDrivenRef.current = true;

        if (isDefined(direction)) {
            engine.moveSelection(direction);
        } else if (isDefined(digit)) {
            engine.inputValue(digit);
        } else {
            engine.toggleInputMode();
        }
    };

    return (
        <div
            aria-label={labels.board}
            className={getFieldClassName('field-board', className)}
            data-input-mode={snapshot.inputMode}
            onKeyDown={handleKeyDown}
            role="grid"
        >
            {snapshot.field.map((row, rowIndex) => (
                <div className="field-board__row" key={rowIndex} role="row">
                    {row.map(cell => {
                        const view = buildFieldCellView(cell, getFieldCellCandidates(snapshot, cell), context);
                        const cellRef = view.isSelected ? selectedCellRef : null;
                        const isFocusable = view.key === focusableCellKey;

                        return (
                            <FieldCell
                                isFocusable={isFocusable}
                                key={view.key}
                                label={labels.cell(cell)}
                                onSelect={handleSelect}
                                ref={cellRef}
                                view={view}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
