import Link from 'next/link';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    label: string;
    metadata: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const DifficultyNavigationLink = ({ label, metadata }: Props) => (
    <Link className="difficulty-chain__link" href={metadata.path}>
        <span className="difficulty-chain__label">{label}</span>
        <span className="difficulty-chain__title">{metadata.title}</span>
    </Link>
);
