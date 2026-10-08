'use client';

import { getWitnessPoint } from '../../utils/get-witness-point.util';

import type { FieldWitnessBranchType, FieldWitnessImplicationType } from '../../types/field-witness-branch.type';

const centerCandidateValue = 5;
const outlineSize = 2.9;
const outlineOffset = outlineSize / 2;

interface Props {
    branch: FieldWitnessBranchType;
    showOutcome: boolean;
    visibleImplications: readonly FieldWitnessImplicationType[];
}

export const FieldBranchWitnessEvidence = ({ branch, showOutcome, visibleImplications }: Props) => {
    const latestImplication = visibleImplications.at(-1);
    const supportCells = latestImplication && 'supportCells' in latestImplication ? latestImplication.supportCells : [];
    const { outcome } = branch;
    const outcomeCells: { readonly x: number; readonly y: number }[] = [];
    const outcomeCandidates: FieldWitnessBranchType['assumption'][] = [];

    if (showOutcome && 'unitCells' in outcome) {
        outcomeCells.push(...outcome.unitCells);
    } else if (showOutcome && 'cell' in outcome && !('value' in outcome)) {
        outcomeCells.push(outcome.cell);
    }

    if (showOutcome && 'cell' in outcome && 'value' in outcome) {
        outcomeCandidates.push(outcome);
    } else if (showOutcome && 'eliminations' in outcome) {
        outcomeCandidates.push(...outcome.eliminations);
    }

    return (
        <g>
            {supportCells.map((cell, index) => {
                const center = getWitnessPoint(cell, centerCandidateValue);
                const originX = center.x - outlineOffset;
                const originY = center.y - outlineOffset;

                return (
                    <rect data-support="true" height={outlineSize} key={`support-${index}`} width={outlineSize} x={originX} y={originY} />
                );
            })}
            {outcomeCells.map((cell, index) => {
                const center = getWitnessPoint(cell, centerCandidateValue);
                const originX = center.x - outlineOffset;
                const originY = center.y - outlineOffset;
                const outcomeKind = outcome.kind;

                return (
                    <rect
                        data-outcome={outcomeKind}
                        height={outlineSize}
                        key={`outcome-${index}`}
                        width={outlineSize}
                        x={originX}
                        y={originY}
                    />
                );
            })}
            {outcomeCandidates.map((candidate, index) => {
                const center = getWitnessPoint(candidate.cell, candidate.value);
                const outcomeKind = outcome.kind;

                return (
                    <circle
                        className="field-board__witness-outcome"
                        cx={center.x}
                        cy={center.y}
                        data-outcome={outcomeKind}
                        key={`candidate-${index}`}
                        r="0.5"
                    />
                );
            })}
        </g>
    );
};
