'use client';

import { StepScriptStepKindEnum, type StepScriptStateInterface } from '@suuudokuuu/field-core';

import { FieldBranchWitness } from '../field-branch-witness/field-branch-witness';
import { FieldChainWitness } from '../field-chain-witness/field-chain-witness';

import type { FieldCellType } from '../../types/field-cell.type';

interface Props {
    explanation: NonNullable<StepScriptStateInterface['explanation']>;
    filledCells: readonly FieldCellType[];
}

export const FieldWitnessOverlay = ({ explanation, filledCells }: Props) => (
    <svg aria-hidden="true" className="field-board__witness" data-witness={explanation.kind} viewBox="0 0 27 27">
        {explanation.kind === StepScriptStepKindEnum.SHOW_CHAIN ? (
            <FieldChainWitness chain={explanation.chain} filledCells={filledCells} />
        ) : (
            <FieldBranchWitness step={explanation} />
        )}
    </svg>
);
