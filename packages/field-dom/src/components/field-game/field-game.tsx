'use client';

import { useFieldSnapshot } from '@suuudokuuu/field-core/react';

import { isDefined } from '@rnw-community/shared';

import { useFieldMistakeCell } from '../../hooks/use-field-mistake-cell.hook';
import { getFieldClassName } from '../../utils/get-field-class-name.util';
import { FieldBoard } from '../field-board/field-board';
import { FieldNumberPad } from '../field-number-pad/field-number-pad';
import { FieldStepPlayer } from '../field-step-player/field-step-player';

import type { FieldGameLabelsInterface } from '../../interfaces/field-game-labels.interface';
import type { FieldNarrationRendererType } from '../../types/field-narration-renderer.type';
import type { FieldEngine } from '@suuudokuuu/field-core';

interface Props {
    engine: FieldEngine;
    labels: FieldGameLabelsInterface;
    narrationRenderer: FieldNarrationRendererType;
    givenCellKeys?: ReadonlySet<string>;
    className?: string;
}

export const FieldGame = ({ className, engine, givenCellKeys, labels, narrationRenderer }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const mistakeCell = useFieldMistakeCell(engine, snapshot);
    const boardProps = {
        ...(isDefined(givenCellKeys) && { givenCellKeys }),
        ...(isDefined(mistakeCell) && { mistakeCell })
    };

    return (
        <div className={getFieldClassName('field-game', className)} data-won={snapshot.isWon}>
            <FieldBoard engine={engine} labels={labels.board} {...boardProps} />
            <FieldNumberPad engine={engine} labels={labels.numberPad} />
            <FieldStepPlayer engine={engine} labels={labels.stepPlayer} narrationRenderer={narrationRenderer} />
        </div>
    );
};
