import { hardestSudokuPuzzlesPageMetadata } from '../../../app/(en)/hardest-sudoku-puzzles/metadata';
import { homePageMetadata } from '../../../app/(en)/metadata';
import { ArticleSchema } from '../../../seo/components/article-schema/article-schema';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { PageHeader } from '../../../seo/components/page-header/page-header';

import type { PageMetadataInterface } from '../../../seo/interfaces/page-metadata.interface';

interface Props {
    metadata: PageMetadataInterface;
}

export const FamousPuzzlePageHeader = ({ metadata }: Props) => (
    <>
        <ArticleSchema metadata={metadata} />
        <PageHeader metadata={metadata}>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={hardestSudokuPuzzlesPageMetadata.path}>Hardest sudoku puzzles</BreadcrumbListItem>
            <BreadcrumbListItem>{metadata.title}</BreadcrumbListItem>
        </PageHeader>
    </>
);
