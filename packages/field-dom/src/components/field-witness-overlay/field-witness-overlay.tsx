'use client';

import { StepScriptStepKindEnum, type StepScriptStateInterface } from '@suuudokuuu/field-core';

import { FieldBranchWitness } from '../field-branch-witness/field-branch-witness';
import { FieldChainWitness } from '../field-chain-witness/field-chain-witness';

import type { FieldCellType } from '../../types/field-cell.type';

interface Props {
    explanation: NonNullable<StepScriptStateInterface['explanation']>;
    filledCells: readonly FieldCellType[];
}

export const FieldWitnessOverlay = ({ explanation, filledCells }: Props) => {
    if (explanation.kind === StepScriptStepKindEnum.SHOW_CHAIN) {
        return <FieldChainWitness chain={explanation.chain} filledCells={filledCells} visibleLength={explanation.visibleLength} />;
    }

    return (
        <FieldBranchWitness
            branch={explanation.branch}
            filledCells={filledCells}
            showOutcome={explanation.showOutcome}
            visibleImplicationCount={explanation.visibleImplicationCount}
        />
    );
};
