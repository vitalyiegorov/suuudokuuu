import Link from 'next/link';

import type { SolverStepInterface } from '../../interfaces/solver-step.interface';

interface Props {
    step: SolverStepInterface;
}

export const SolvePathStep = ({ step }: Props) => (
    <li className="solve-path__step">
        <span>{step.narration}</span>{' '}
        <Link className="solve-path__technique" href={step.techniquePath}>
            {step.techniqueName}
        </Link>
    </li>
);
