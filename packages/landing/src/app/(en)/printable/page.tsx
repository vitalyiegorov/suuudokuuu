import { PrintableSudokuPage } from '../../../printable/components/printable-sudoku-page/printable-sudoku-page';
import { DEFAULT_LOCALE } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';

import { printableSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableSudokuPageMetadata);

const EnglishPrintableSudokuPage = () => <PrintableSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableSudokuPage;
