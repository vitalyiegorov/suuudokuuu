import Link from 'next/link';

import { getActiveLocale } from '../../../i18n/utils/get-active-locale.util';
import { buildLocalizedPagePath } from '../../../seo/utils/build-localized-page-path.util';
import { localizePageMetadata } from '../../../seo/utils/localize-page-metadata.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    readonly metadata: Pick<PageMetadataInterface, 'path' | 'title' | 'translations'>;
}

export const DifficultyLink = ({ metadata }: Props) => (
    <li>
        <Link href={buildLocalizedPagePath(metadata)}>{localizePageMetadata(metadata, getActiveLocale()).title}</Link>
    </li>
);
