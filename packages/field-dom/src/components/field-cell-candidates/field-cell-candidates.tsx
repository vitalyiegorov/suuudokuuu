'use client';

const candidateValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface Props {
    readonly candidates: number[];
    readonly eliminatedCandidates: number[];
}

export const FieldCellCandidates = ({ candidates, eliminatedCandidates }: Props) => (
    <span aria-hidden="true" className="field-cell__candidates">
        {candidateValues.map(candidateValue => {
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
