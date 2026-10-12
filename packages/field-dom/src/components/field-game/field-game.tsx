'use client';

import { useFieldSnapshot } from '@suuudokuuu/field-core/react';

import { isDefined } from '@rnw-community/shared';

import { useFieldMistakeCell } from '../../hooks/use-field-mistake-cell.hook';
import { FieldBoard } from '../field-board/field-board';
import { FieldNumberPad } from '../field-number-pad/field-number-pad';
import { FieldStepPlayer } from '../field-step-player/field-step-player';

import type { FieldGameLabelsInterface } from '../../interfaces/field-game-labels.interface';
import type { FieldNarrationRendererType } from '../../types/field-narration-renderer.type';
import type { FieldEngine } from '@suuudokuuu/field-core';

interface Props {
    readonly engine: FieldEngine;
    readonly labels: FieldGameLabelsInterface;
    readonly narrationRenderer: FieldNarrationRendererType;
    readonly givenCellKeys?: ReadonlySet<string>;
}

export const FieldGame = ({ engine, givenCellKeys, labels, narrationRenderer }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const mistakeCell = useFieldMistakeCell(engine, snapshot);
    const boardProps = {
        ...(isDefined(givenCellKeys) && { givenCellKeys }),
        ...(isDefined(mistakeCell) && { mistakeCell })
    };

    return (
        <div className="field-game" data-won={snapshot.isWon}>
            <FieldBoard engine={engine} labels={labels.board} {...boardProps} />
            <FieldNumberPad engine={engine} labels={labels.numberPad} />
            <FieldStepPlayer engine={engine} labels={labels.stepPlayer} narrationRenderer={narrationRenderer} />
        </div>
    );
};
