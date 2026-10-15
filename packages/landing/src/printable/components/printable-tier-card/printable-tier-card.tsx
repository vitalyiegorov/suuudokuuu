import { Trans } from '@lingui/react/macro';
import Link from 'next/link';

import { PRINTABLE_BOOKLET_PAGE_COUNT } from '../../constants/printable-page-count.constant';
import { PRINTABLE_BOOKLET_SIZE } from '../../constants/printable-sample.constant';
import { PrintableDownloadCard } from '../printable-download-card/printable-download-card';
import { PrintableDownloadFact } from '../printable-download-fact/printable-download-fact';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly fileName: string;
    readonly href: string;
    readonly label: string;
    readonly title: string;
}

export const PrintableTierCard = ({ children, fileName, href, label, title }: Props) => (
    <article className="printable-tier">
        <h3>
            <Link href={href}>{label}</Link>
        </h3>
        <p>{children}</p>
        <PrintableDownloadCard fileName={fileName} title={title}>
            <PrintableDownloadFact>
                <Trans>{PRINTABLE_BOOKLET_SIZE} puzzles</Trans>
            </PrintableDownloadFact>
            <PrintableDownloadFact>
                <Trans>{PRINTABLE_BOOKLET_PAGE_COUNT} pages</Trans>
            </PrintableDownloadFact>
            <PrintableDownloadFact>
                <Trans>Solutions included on the last pages</Trans>
            </PrintableDownloadFact>
        </PrintableDownloadCard>
    </article>
);
