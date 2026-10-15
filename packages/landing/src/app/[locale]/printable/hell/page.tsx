import { printableHellSudokuPageMetadata } from '../../../(en)/printable/hell/metadata';
import { PrintableHellSudokuPage } from '../../../../printable/components/printable-hell-sudoku-page/printable-hell-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableHellSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableHellSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableHellSudokuPage = async ({ params }: Props) => (
    <PrintableHellSudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableHellSudokuPage;
