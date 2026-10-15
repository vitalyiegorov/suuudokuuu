import { PrintableHardSudokuPage } from '../../../../printable/components/printable-hard-sudoku-page/printable-hard-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { printableHardSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableHardSudokuPageMetadata);

const EnglishPrintableHardSudokuPage = () => <PrintableHardSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableHardSudokuPage;
