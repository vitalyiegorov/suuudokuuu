import { PrintableNightmareSudokuPage } from '../../../../printable/components/printable-nightmare-sudoku-page/printable-nightmare-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { printableNightmareSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableNightmareSudokuPageMetadata);

const EnglishPrintableNightmareSudokuPage = () => <PrintableNightmareSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableNightmareSudokuPage;
