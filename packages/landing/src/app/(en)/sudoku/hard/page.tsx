import { HardSudokuPage } from '../../../../difficulty/components/hard-sudoku-page/hard-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { hardSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hardSudokuPageMetadata);

const EnglishHardSudokuPage = () => <HardSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishHardSudokuPage;
