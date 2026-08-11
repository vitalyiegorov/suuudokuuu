import Link from 'next/link';

import type { SolverStepInterface } from '../../interfaces/solver-step.interface';
import type { ReactNode } from 'react';

interface Props {
    step: SolverStepInterface;
    isSelected: boolean;
    onSelect: (index: number) => void;
    children: ReactNode;
}

export const SolverStepItem = ({ children, isSelected, onSelect, step }: Props) => {
    const handleToggle = () => {
        onSelect(step.index);
    };

    return (
        <li className="solver-steps__item">
            <button
                aria-expanded={isSelected}
                className="solver-steps__toggle"
                data-selected={isSelected}
                onClick={handleToggle}
                type="button"
            >
                <span className="solver-steps__index">{step.index + 1}</span>
                <span className="solver-steps__narration">{step.narration}</span>
            </button>
            <Link className="solver-steps__technique" href={step.techniquePath}>
                {step.techniqueName}
            </Link>
            {children}
        </li>
    );
};
