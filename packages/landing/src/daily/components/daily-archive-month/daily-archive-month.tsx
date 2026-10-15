import Link from 'next/link';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    metadata: Pick<PageMetadataInterface, 'path' | 'title'>;
}

export const DailyArchiveMonth = ({ metadata }: Props) => (
    <li>
        <Link href={metadata.path}>{metadata.title}</Link>
    </li>
);
