import { useLingui } from '@lingui/react/macro';

import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const TechniqueSummary = ({ children }: Props) => {
    const { t } = useLingui();

    return (
        <aside aria-label={t`Summary`} className="technique-summary">
            <p className="technique-summary__label">{t`TL;DR`}</p>
            {children}
        </aside>
    );
};
