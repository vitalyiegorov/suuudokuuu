'use client';

import { useFieldSnapshot } from '@suuudokuuu/field-core/react';

import { buildFieldPadValues } from '../../utils/build-field-pad-values.util';
import { getFieldClassName } from '../../utils/get-field-class-name.util';

import type { FieldNumberPadLabelsInterface } from '../../interfaces/field-number-pad-labels.interface';
import type { FieldEngine } from '@suuudokuuu/field-core';

interface Props {
    engine: FieldEngine;
    labels: FieldNumberPadLabelsInterface;
    className?: string;
}

export const FieldNumberPad = ({ className, engine, labels }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const padValues = buildFieldPadValues(snapshot.field);
    const isCandidateMode = snapshot.inputMode === 'candidate';
    const isUndoDisabled = !snapshot.canUndo;
    const isRedoDisabled = !snapshot.canRedo;

    const handleToggleInputMode = () => {
        engine.toggleInputMode();
    };

    const handleUndo = () => {
        engine.undo();
    };

    const handleRedo = () => {
        engine.redo();
    };

    return (
        <div aria-label={labels.numberPad} className={getFieldClassName('field-number-pad', className)} role="group">
            <div className="field-number-pad__digits">
                {padValues.map(padValue => {
                    const digitLabel = labels.digit(padValue.value, padValue.remaining);
                    const handleInput = () => {
                        engine.inputValue(padValue.value);
                    };

                    return (
                        <button
                            aria-label={digitLabel}
                            className="field-number-pad__digit"
                            data-complete={padValue.isComplete}
                            disabled={padValue.isComplete}
                            key={padValue.value}
                            onClick={handleInput}
                            type="button"
                        >
                            <span className="field-number-pad__digit-value">{padValue.value}</span>
                            <span aria-hidden="true" className="field-number-pad__digit-remaining">
                                {padValue.remaining}
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="field-number-pad__actions">
                <button
                    aria-pressed={isCandidateMode}
                    className="field-number-pad__action"
                    data-active={isCandidateMode}
                    onClick={handleToggleInputMode}
                    type="button"
                >
                    {labels.candidateMode}
                </button>
                <button className="field-number-pad__action" disabled={isUndoDisabled} onClick={handleUndo} type="button">
                    {labels.undo}
                </button>
                <button className="field-number-pad__action" disabled={isRedoDisabled} onClick={handleRedo} type="button">
                    {labels.redo}
                </button>
            </div>
        </div>
    );
};
