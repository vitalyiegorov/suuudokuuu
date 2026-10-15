import { PrintableHellSudokuPage } from '../../../../printable/components/printable-hell-sudoku-page/printable-hell-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { printableHellSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableHellSudokuPageMetadata);

const EnglishPrintableHellSudokuPage = () => <PrintableHellSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableHellSudokuPage;
