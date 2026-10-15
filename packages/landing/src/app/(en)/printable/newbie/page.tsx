import { PrintableNewbieSudokuPage } from '../../../../printable/components/printable-newbie-sudoku-page/printable-newbie-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { printableNewbieSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableNewbieSudokuPageMetadata);

const EnglishPrintableNewbieSudokuPage = () => <PrintableNewbieSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableNewbieSudokuPage;
