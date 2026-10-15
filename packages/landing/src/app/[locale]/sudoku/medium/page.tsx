import { mediumSudokuPageMetadata } from '../../../(en)/sudoku/medium/metadata';
import { MediumSudokuPage } from '../../../../difficulty/components/medium-sudoku-page/medium-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(mediumSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(mediumSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedMediumSudokuPage = async ({ params }: Props) => <MediumSudokuPage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedMediumSudokuPage;
