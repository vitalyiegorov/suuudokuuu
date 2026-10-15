import { SolvePathStep } from '../solve-path-step/solve-path-step';

import type { SolverStepInterface } from '../../interfaces/solver-step.interface';

interface Props {
    steps: readonly SolverStepInterface[];
}

export const SolvePathList = ({ steps }: Props) => (
    <ol className="solve-path">
        {steps.map(step => (
            <SolvePathStep key={step.index} step={step} />
        ))}
    </ol>
);
