import type { TechniqueExampleCellInterface } from '../../interfaces/technique-example-cell.interface';

const CANDIDATE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

interface Props {
    cell: TechniqueExampleCellInterface;
}

export const TechniqueExampleCellCandidates = ({ cell }: Props) => (
    <span className="sudoku-cell__candidates">
        {CANDIDATE_VALUES.map(candidateValue => {
            const isPresent = cell.candidates.includes(candidateValue);
            const isEliminated = cell.eliminatedCandidates.includes(candidateValue);
            const candidateText = isPresent ? candidateValue : '';

            return (
                <span className="sudoku-cell__candidate" data-eliminated={isEliminated} data-present={isPresent} key={candidateValue}>
                    {candidateText}
                </span>
            );
        })}
    </span>
);
