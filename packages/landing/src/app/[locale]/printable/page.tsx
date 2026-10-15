import { printableSudokuPageMetadata } from '../../(en)/printable/metadata';
import { PrintableSudokuPage } from '../../../printable/components/printable-sudoku-page/printable-sudoku-page';
import { buildLocaleStaticParams } from '../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableSudokuPage = async ({ params }: Props) => (
    <PrintableSudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableSudokuPage;
