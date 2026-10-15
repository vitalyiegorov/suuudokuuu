import { newbieSudokuPageMetadata } from '../../../(en)/sudoku/newbie/metadata';
import { NewbieSudokuPage } from '../../../../difficulty/components/newbie-sudoku-page/newbie-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(newbieSudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(newbieSudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedNewbieSudokuPage = async ({ params }: Props) => <NewbieSudokuPage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedNewbieSudokuPage;
