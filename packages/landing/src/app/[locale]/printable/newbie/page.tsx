import { printableNewbieSudokuPageMetadata } from '../../../(en)/printable/newbie/metadata';
import { PrintableNewbieSudokuPage } from '../../../../printable/components/printable-newbie-sudoku-page/printable-newbie-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableNewbieSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableNewbieSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableNewbieSudokuPage = async ({ params }: Props) => (
    <PrintableNewbieSudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableNewbieSudokuPage;
