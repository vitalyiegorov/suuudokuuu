import { homePageMetadata } from '../../../app/metadata';
import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageHeader } from '../../../seo/components/page-header/page-header';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    metadata: PageMetadataInterface;
}

export const TechniquePageHeader = ({ metadata }: Props) => (
    <PageHeader metadata={metadata}>
        <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
        <BreadcrumbListItem path={techniquesPageMetadata.path}>Sudoku techniques</BreadcrumbListItem>
        <BreadcrumbListItem>{metadata.title}</BreadcrumbListItem>
    </PageHeader>
);
