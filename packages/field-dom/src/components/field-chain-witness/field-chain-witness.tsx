'use client';

import { StepScriptStepKindEnum, type StepScriptStateInterface } from '@suuudokuuu/field-core';

import { getWitnessPoint } from '../../utils/get-witness-point.util';
import { FieldWitnessLinkMask } from '../field-witness-link-mask/field-witness-link-mask';

import type { FieldCellType } from '../../types/field-cell.type';

const digitBaselineOffset = 0.22;

interface Props {
    chain: Extract<NonNullable<StepScriptStateInterface['explanation']>, { kind: StepScriptStepKindEnum.SHOW_CHAIN }>['chain'];
    filledCells: readonly FieldCellType[];
    visibleLength: number;
}

export const FieldChainWitness = ({ chain, filledCells, visibleLength }: Props) => {
    const visibleCandidates = chain.slice(0, visibleLength);

    return (
        <svg aria-hidden="true" className="field-board__witness" viewBox="0 0 27 27">
            <FieldWitnessLinkMask filledCells={filledCells}>
                {visibleCandidates.slice(1).map((candidate, index) => {
                    const previous = getWitnessPoint(visibleCandidates[index].cell, visibleCandidates[index].value);
                    const current = getWitnessPoint(candidate.cell, candidate.value);
                    const link = String(candidate.link);

                    return <line data-link={link} key={`link-${index}`} x1={previous.x} x2={current.x} y1={previous.y} y2={current.y} />;
                })}
            </FieldWitnessLinkMask>
            {visibleCandidates.map((candidate, index) => {
                const center = getWitnessPoint(candidate.cell, candidate.value);
                const candidateKey = `${candidate.cell.y}-${candidate.cell.x}-${candidate.value}`;
                const digitBaseline = center.y + digitBaselineOffset;

                return (
                    <g data-candidate={candidateKey} key={`candidate-${index}`}>
                        <circle cx={center.x} cy={center.y} r="0.39" />
                        <text textAnchor="middle" x={center.x} y={digitBaseline}>
                            {candidate.value}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};
