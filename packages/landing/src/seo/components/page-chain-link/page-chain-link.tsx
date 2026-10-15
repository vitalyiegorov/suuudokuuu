import Link from 'next/link';

import { getActiveLocale } from '../../../i18n/utils/get-active-locale.util';
import { buildLocalizedPagePath } from '../../utils/build-localized-page-path.util';
import { localizePageMetadata } from '../../utils/localize-page-metadata.util';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    label: string;
    metadata: Pick<PageMetadataInterface, 'path' | 'title' | 'translations'>;
}

export const PageChainLink = ({ label, metadata }: Props) => (
    <Link className="page-chain__link" href={buildLocalizedPagePath(metadata)}>
        <span className="page-chain__label">{label}</span>
        <span className="page-chain__title">{localizePageMetadata(metadata, getActiveLocale()).title}</span>
    </Link>
);
