'use client';

import { getWitnessPoint } from '../../utils/get-witness-point.util';

import type { FieldWitnessBranchType, FieldWitnessImplicationType } from '../../types/field-witness-branch.type';

const digitBaselineOffset = 0.22;

interface Props {
    branch: FieldWitnessBranchType;
    visibleImplications: readonly FieldWitnessImplicationType[];
}

export const FieldBranchWitnessCandidates = ({ branch, visibleImplications }: Props) => {
    const assumption = getWitnessPoint(branch.assumption.cell, branch.assumption.value);
    const assumptionKey = `${branch.assumption.cell.y}-${branch.assumption.cell.x}-${branch.assumption.value}`;
    const assumptionBaseline = assumption.y + digitBaselineOffset;

    return (
        <g>
            {visibleImplications.map((implication, index) => {
                const center = getWitnessPoint(implication.cell, implication.value);
                const candidateKey = `${implication.cell.y}-${implication.cell.x}-${implication.value}`;
                const isRemoval = 'source' in implication;
                const implicationKind = implication.kind;
                const digitBaseline = center.y + digitBaselineOffset;

                return (
                    <g
                        data-candidate={candidateKey}
                        data-implication={implicationKind}
                        data-removal={isRemoval}
                        key={`implication-${index}`}
                    >
                        <circle cx={center.x} cy={center.y} r="0.39" />
                        <text textAnchor="middle" x={center.x} y={digitBaseline}>
                            {implication.value}
                        </text>
                    </g>
                );
            })}
            <g data-assumption="true" data-candidate={assumptionKey}>
                <circle cx={assumption.x} cy={assumption.y} r="0.39" />
                <text textAnchor="middle" x={assumption.x} y={assumptionBaseline}>
                    {branch.assumption.value}
                </text>
            </g>
        </g>
    );
};
