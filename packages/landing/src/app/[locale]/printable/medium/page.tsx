import { printableMediumSudokuPageMetadata } from '../../../(en)/printable/medium/metadata';
import { PrintableMediumSudokuPage } from '../../../../printable/components/printable-medium-sudoku-page/printable-medium-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableMediumSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableMediumSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableMediumSudokuPage = async ({ params }: Props) => (
    <PrintableMediumSudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableMediumSudokuPage;
