'use client';

import { getCellKey } from '@suuudokuuu/field-core';
import { useId } from 'react';

import { getWitnessPoint } from '../../utils/get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';

import type { FieldCellType } from '../../types/field-cell.type';
import type { StepScriptChainStepInterface } from '@suuudokuuu/field-core';

const cellUnitSize = 3;
const valueOriginX = 0.45;
const valueOriginY = 0.225;

interface Props {
    readonly chain: StepScriptChainStepInterface['chain'];
    readonly filledCells: readonly FieldCellType[];
}

export const FieldChainWitness = ({ chain, filledCells }: Props) => {
    const maskId = useId().replaceAll(':', '');

    return (
        <>
            <defs>
                <mask height="27" id={maskId} maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse" width="27" x="0" y="0">
                    <rect fill="white" height="27" width="27" x="0" y="0" />
                    {filledCells.map(cell => {
                        const originX = cell.x * cellUnitSize + valueOriginX;
                        const originY = cell.y * cellUnitSize + valueOriginY;

                        return <rect fill="black" height="2.55" key={getCellKey(cell)} width="2.1" x={originX} y={originY} />;
                    })}
                </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
                {chain.slice(1).map((candidate, index) => {
                    const previous = getWitnessPoint(chain[index].cell, chain[index].value);
                    const current = getWitnessPoint(candidate.cell, candidate.value);

                    return (
                        <line
                            data-link={candidate.link}
                            key={`link-${index}`}
                            x1={previous.x}
                            x2={current.x}
                            y1={previous.y}
                            y2={current.y}
                        />
                    );
                })}
            </g>
            {chain.map((candidate, index) => (
                <FieldWitnessCandidate candidate={candidate} key={`candidate-${index}`} />
            ))}
        </>
    );
};
