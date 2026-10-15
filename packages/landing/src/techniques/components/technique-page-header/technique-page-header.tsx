import { homePageMetadata } from '../../../app/(en)/metadata';
import { techniquesPageMetadata } from '../../../app/(en)/techniques/metadata';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageHeader } from '../../../seo/components/page-header/page-header';
import { buildAuthorPersonSchema } from '../../../seo/utils/build-author-person-schema.util';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    readonly metadata: PageMetadataInterface;
}

export const TechniquePageHeader = ({ metadata }: Props) => (
    <>
        <ArticleSchema author={buildAuthorPersonSchema()} metadata={metadata} />
        <PageHeader metadata={metadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={techniquesPageMetadata.path}>Sudoku techniques</BreadcrumbListItem>
            <BreadcrumbListItem>{metadata.title}</BreadcrumbListItem>
        </PageHeader>
    </>
);
