import { HellSudokuPage } from '../../../../difficulty/components/hell-sudoku-page/hell-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { hellSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(hellSudokuPageMetadata);

const EnglishHellSudokuPage = () => <HellSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishHellSudokuPage;
