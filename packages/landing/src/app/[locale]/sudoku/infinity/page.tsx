import { infinitySudokuPageMetadata } from '../../../(en)/sudoku/infinity/metadata';
import { InfinitySudokuPage } from '../../../../difficulty/components/infinity-sudoku-page/infinity-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(infinitySudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(infinitySudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedInfinitySudokuPage = async ({ params }: Props) => (
    <InfinitySudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedInfinitySudokuPage;
