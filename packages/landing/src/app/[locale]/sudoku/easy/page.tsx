import { easySudokuPageMetadata } from '../../../(en)/sudoku/easy/metadata';
import { EasySudokuPage } from '../../../../difficulty/components/easy-sudoku-page/easy-sudoku-page';
import { buildLocaleStaticParams } from '../../../../seo/utils/build-locale-static-params.util';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';
import { resolveLocaleSegment } from '../../../../seo/utils/resolve-locale-segment.util';

import type { Metadata } from 'next';

interface Props {
    params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => buildLocaleStaticParams(easySudokuPageMetadata);

export const generateMetadata = async ({ params }: Props): Promise<Metadata> =>
    buildPageMetadata(easySudokuPageMetadata, resolveLocaleSegment((await params).locale));

const LocalizedEasySudokuPage = async ({ params }: Props) => <EasySudokuPage locale={resolveLocaleSegment((await params).locale)} />;

export default LocalizedEasySudokuPage;
