'use client';

import { getWitnessPoint } from '../../utils/get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';
import { FieldWitnessLinkMask } from '../field-witness-link-mask/field-witness-link-mask';

import type { FieldCellType } from '../../types/field-cell.type';
import type { StepScriptChainStepInterface } from '@suuudokuuu/field-core';

interface Props {
    chain: StepScriptChainStepInterface['chain'];
    filledCells: readonly FieldCellType[];
}

export const FieldChainWitness = ({ chain, filledCells }: Props) => (
    <>
        <FieldWitnessLinkMask filledCells={filledCells}>
            {chain.slice(1).map((candidate, index) => {
                const previous = getWitnessPoint(chain[index].cell, chain[index].value);
                const current = getWitnessPoint(candidate.cell, candidate.value);

                return (
                    <line data-link={candidate.link} key={`link-${index}`} x1={previous.x} x2={current.x} y1={previous.y} y2={current.y} />
                );
            })}
        </FieldWitnessLinkMask>
        {chain.map((candidate, index) => (
            <FieldWitnessCandidate candidate={candidate} key={`candidate-${index}`} />
        ))}
    </>
);
