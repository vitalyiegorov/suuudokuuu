import { printableHardSudokuPageMetadata } from '../../../(en)/printable/hard/metadata';
import { PrintableHardSudokuPage } from '../../../../printable/components/printable-hard-sudoku-page/printable-hard-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(printableHardSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(printableHardSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedPrintableHardSudokuPage = async ({ params }: Props) => (
    <PrintableHardSudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedPrintableHardSudokuPage;
