import Link from 'next/link';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    label: string;
    metadata: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const PageChainLink = ({ label, metadata }: Props) => (
    <Link className="page-chain__link" href={metadata.path}>
        <span className="page-chain__label">{label}</span>
        <span className="page-chain__title">{metadata.title}</span>
    </Link>
);
