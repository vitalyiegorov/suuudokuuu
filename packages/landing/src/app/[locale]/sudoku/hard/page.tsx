import { hardSudokuPageMetadata } from '../../../(en)/sudoku/hard/metadata';
import { HardSudokuPage } from '../../../../difficulty/components/hard-sudoku-page/hard-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(hardSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(hardSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedHardSudokuPage = async ({ params }: Props) => <HardSudokuPage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedHardSudokuPage;
