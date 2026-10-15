import { hellSudokuPageMetadata } from '../../../(en)/sudoku/hell/metadata';
import { HellSudokuPage } from '../../../../difficulty/components/hell-sudoku-page/hell-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(hellSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(hellSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedHellSudokuPage = async ({ params }: Props) => <HellSudokuPage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedHellSudokuPage;
