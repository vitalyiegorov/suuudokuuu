'use client';

import { CANDIDATE_VALUES } from '../../constants/field-grid.constant';

interface Props {
    candidates: number[];
    eliminatedCandidates: number[];
}

export const FieldCellCandidates = ({ candidates, eliminatedCandidates }: Props) => (
    <span aria-hidden="true" className="field-cell__candidates">
        {CANDIDATE_VALUES.map(candidateValue => {
            const isPresent = candidates.includes(candidateValue);
            const isEliminated = eliminatedCandidates.includes(candidateValue);
            const candidateText = isPresent ? candidateValue : '';

            return (
                <span className="field-cell__candidate" data-eliminated={isEliminated} data-present={isPresent} key={candidateValue}>
                    {candidateText}
                </span>
            );
        })}
    </span>
);
