import { PrintableMediumSudokuPage } from '../../../../printable/components/printable-medium-sudoku-page/printable-medium-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { printableMediumSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(printableMediumSudokuPageMetadata);

const EnglishPrintableMediumSudokuPage = () => <PrintableMediumSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishPrintableMediumSudokuPage;
