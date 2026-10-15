import { sudokuDifficultiesPageMetadata } from '../../(en)/sudoku/metadata';
import { SudokuDifficultiesPage } from '../../../difficulty/components/sudoku-difficulties-page/sudoku-difficulties-page';
import { buildLocaleStaticParams } from '../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(sudokuDifficultiesPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(sudokuDifficultiesPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedSudokuDifficultiesPage = async ({ params }: Props) => (
    <SudokuDifficultiesPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedSudokuDifficultiesPage;
