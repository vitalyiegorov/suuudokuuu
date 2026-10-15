import { PrintableInfinitySudokuPage } from '../../../../printable/components/printable-infinity-sudoku-page/printable-infinity-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { printableInfinitySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableInfinitySudokuPageMetadata);

const EnglishPrintableInfinitySudokuPage = () => <PrintableInfinitySudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableInfinitySudokuPage;
