import type { SolverUniquenessFailureInterface } from '../../interfaces/solver-uniqueness-failure.interface';

interface Props {
    failure: SolverUniquenessFailureInterface;
}

export const SolverUniquenessNotice = ({ failure }: Props) => {
    if (failure.kind === 'no-solution') {
        return (
            <p className="solver-notice" data-tone="error" role="status">
                No solution — no digit repeats, but the givens still cannot all be completed into one valid grid. Check your entries against
                the original puzzle.
            </p>
        );
    }

    if (failure.kind === 'multiple-solutions') {
        return (
            <p className="solver-notice" data-tone="error" role="status">
                More than one solution — this is not a proper sudoku. A valid puzzle has exactly one solution, so there is no single answer
                to narrate. Add the givens you left out and solve again.
            </p>
        );
    }

    return (
        <p className="solver-notice" data-tone="error" role="status">
            The two solvers disagreed — the bitmask solver counted {failure.bitmaskCount} and the DLX solver counted {failure.dlxCount}.
            That is a bug in Suuudokuuu, not in your puzzle. Please report it.
        </p>
    );
};
