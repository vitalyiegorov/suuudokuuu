import { PrintableEasySudokuPage } from '../../../../printable/components/printable-easy-sudoku-page/printable-easy-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { printableEasySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableEasySudokuPageMetadata);

const EnglishPrintableEasySudokuPage = () => <PrintableEasySudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableEasySudokuPage;
