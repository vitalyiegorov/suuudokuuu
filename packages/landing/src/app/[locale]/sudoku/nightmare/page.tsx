import { nightmareSudokuPageMetadata } from '../../../(en)/sudoku/nightmare/metadata';
import { NightmareSudokuPage } from '../../../../difficulty/components/nightmare-sudoku-page/nightmare-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(nightmareSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(nightmareSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedNightmareSudokuPage = async ({ params }: Props) => (
    <NightmareSudokuPage locale={resolveLocaleSegment((await params).locale)} />
);

export default LocalizedNightmareSudokuPage;
