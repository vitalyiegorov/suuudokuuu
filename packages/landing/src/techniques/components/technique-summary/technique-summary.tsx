import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const TechniqueSummary = ({ children }: Props) => (
    <aside aria-label="Summary" className="technique-summary">
        <p className="technique-summary__label">TL;DR</p>
        {children}
    </aside>
);
