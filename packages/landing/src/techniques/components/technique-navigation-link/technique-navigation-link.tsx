import Link from 'next/link';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    label: string;
    metadata: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const TechniqueNavigationLink = ({ label, metadata }: Props) => (
    <Link className="technique-chain__link" href={metadata.path}>
        <span className="technique-chain__label">{label}</span>
        <span className="technique-chain__title">{metadata.title}</span>
    </Link>
);
