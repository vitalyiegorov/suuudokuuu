import type { SolverConflictInterface } from '../../interfaces/solver-conflict.interface';

interface Props {
    conflict: SolverConflictInterface;
}

export const SolverInvalidGridNotice = ({ conflict }: Props) => (
    <p className="solver-notice" data-tone="error" role="status">
        No solution — {conflict.firstCell} and {conflict.secondCell} both hold {conflict.value} in {conflict.unitName}, and a digit can
        appear only once in each row, column and box. Fix one of the two entries and solve again.
    </p>
);
