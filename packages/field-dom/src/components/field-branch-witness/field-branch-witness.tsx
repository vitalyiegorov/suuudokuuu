'use client';

import { getWitnessPoint } from '../../utils/get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';

import type { StepScriptBranchStepInterface } from '@suuudokuuu/field-core';

const centerCandidateValue = 5;
const outlineSize = 2.9;

interface Props {
    step: StepScriptBranchStepInterface;
}

export const FieldBranchWitness = ({ step }: Props) => (
    <>
        {step.outcomeCells.map((cell, index) => {
            const center = getWitnessPoint(cell, centerCandidateValue);
            const originX = center.x - outlineSize / 2;
            const originY = center.y - outlineSize / 2;

            return <rect data-outcome="true" height={outlineSize} key={`outcome-${index}`} width={outlineSize} x={originX} y={originY} />;
        })}
        {step.branch.implications.map((implication, index) => (
            <FieldWitnessCandidate candidate={implication} key={`implication-${index}`} />
        ))}
        <g data-assumption="true">
            <FieldWitnessCandidate candidate={step.branch.assumption} />
        </g>
        {step.outcomeCandidates.map((candidate, index) => {
            const center = getWitnessPoint(candidate.cell, candidate.value);

            return <circle cx={center.x} cy={center.y} data-outcome="true" key={`outcome-candidate-${index}`} r="0.5" />;
        })}
    </>
);
