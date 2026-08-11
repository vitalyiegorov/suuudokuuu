import { homePageMetadata } from '../../../app/metadata';
import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { BreadcrumbListItem } from '../../../seo/components/breadcrumb-list-item/breadcrumb-list-item';
import { Breadcrumbs } from '../../../seo/components/breadcrumbs/breadcrumbs';

interface Props {
    title: string;
}

export const TechniquePageHeader = ({ title }: Props) => (
    <>
        <Breadcrumbs>
            <BreadcrumbListItem path={homePageMetadata.path}>Home</BreadcrumbListItem>
            <BreadcrumbListItem path={techniquesPageMetadata.path}>Sudoku techniques</BreadcrumbListItem>
            <BreadcrumbListItem>{title}</BreadcrumbListItem>
        </Breadcrumbs>
        <h1>{title} Sudoku Technique</h1>
    </>
);
