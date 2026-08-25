import { resolvePageHeadline } from '../../utils/resolve-page-headline.util';
import { ArticleSchema } from '../article-schema/article-schema';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { UpdatedDate } from '../updated-date/updated-date';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';
import type { ReactNode } from 'react';

interface Props {
    metadata: PageMetadataInterface;
    children: ReactNode;
}

export const PageHeader = ({ children, metadata }: Props) => (
    <>
        <ArticleSchema metadata={metadata} />
        <Breadcrumbs>{children}</Breadcrumbs>
        <h1>{resolvePageHeadline(metadata)}</h1>
        <UpdatedDate updatedAt={metadata.updatedAt} />
    </>
);
