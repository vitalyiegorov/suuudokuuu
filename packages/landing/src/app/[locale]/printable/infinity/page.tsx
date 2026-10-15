import { printableInfinitySudokuPageMetadata } from '../../../(en)/printable/infinity/metadata';
import { PrintableInfinitySudokuPage } from '../../../../printable/components/printable-infinity-sudoku-page/printable-infinity-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableInfinitySudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableInfinitySudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableInfinitySudokuPage = async ({ params }: Props) => (
    <PrintableInfinitySudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableInfinitySudokuPage;
