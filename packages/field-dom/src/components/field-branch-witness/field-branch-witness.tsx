'use client';

import { FieldBranchWitnessCandidates } from '../field-branch-witness-candidates/field-branch-witness-candidates';
import { FieldBranchWitnessEvidence } from '../field-branch-witness-evidence/field-branch-witness-evidence';
import { FieldBranchWitnessLinks } from '../field-branch-witness-links/field-branch-witness-links';
import { FieldWitnessLinkMask } from '../field-witness-link-mask/field-witness-link-mask';

import type { FieldCellType } from '../../types/field-cell.type';
import type { FieldWitnessBranchType } from '../../types/field-witness-branch.type';

interface Props {
    branch: FieldWitnessBranchType;
    filledCells: readonly FieldCellType[];
    showOutcome: boolean;
    visibleImplicationCount: number;
}

export const FieldBranchWitness = ({ branch, filledCells, showOutcome, visibleImplicationCount }: Props) => {
    const visibleImplications = branch.implications.slice(0, visibleImplicationCount);

    return (
        <svg aria-hidden="true" className="field-board__witness" viewBox="0 0 27 27">
            <FieldWitnessLinkMask filledCells={filledCells}>
                <FieldBranchWitnessLinks branch={branch} visibleImplications={visibleImplications} />
            </FieldWitnessLinkMask>
            <FieldBranchWitnessEvidence branch={branch} showOutcome={showOutcome} visibleImplications={visibleImplications} />
            <FieldBranchWitnessCandidates branch={branch} visibleImplications={visibleImplications} />
        </svg>
    );
};
