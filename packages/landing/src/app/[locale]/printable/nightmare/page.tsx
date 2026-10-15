import { printableNightmareSudokuPageMetadata } from '../../../(en)/printable/nightmare/metadata';
import { PrintableNightmareSudokuPage } from '../../../../printable/components/printable-nightmare-sudoku-page/printable-nightmare-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableNightmareSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableNightmareSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableNightmareSudokuPage = async ({ params }: Props) => (
    <PrintableNightmareSudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableNightmareSudokuPage;
