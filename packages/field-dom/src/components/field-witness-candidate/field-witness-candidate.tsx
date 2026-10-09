'use client';

import { getWitnessPoint } from '../../utils/get-witness-point.util';

import type { StepScriptCandidateInterface } from '@suuudokuuu/field-core';

const digitBaselineOffset = 0.22;

interface Props {
    candidate: StepScriptCandidateInterface;
}

export const FieldWitnessCandidate = ({ candidate }: Props) => {
    const { cell, value } = candidate;
    const center = getWitnessPoint(cell, value);
    const candidateKey = `${cell.y}-${cell.x}-${value}`;
    const digitBaseline = center.y + digitBaselineOffset;

    return (
        <g data-candidate={candidateKey}>
            <circle cx={center.x} cy={center.y} r="0.39" />
            <text textAnchor="middle" x={center.x} y={digitBaseline}>
                {value}
            </text>
        </g>
    );
};
