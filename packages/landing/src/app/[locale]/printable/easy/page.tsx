import { printableEasySudokuPageMetadata } from '../../../(en)/printable/easy/metadata';
import { PrintableEasySudokuPage } from '../../../../printable/components/printable-easy-sudoku-page/printable-easy-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableEasySudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableEasySudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableEasySudokuPage = async ({ params }: Props) => (
    <PrintableEasySudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableEasySudokuPage;
