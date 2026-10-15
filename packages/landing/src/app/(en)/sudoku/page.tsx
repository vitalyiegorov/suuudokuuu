import { SudokuDifficultiesPage } from '../../../difficulty/components/sudoku-difficulties-page/sudoku-difficulties-page';
import { DEFAULT_LOCALE } from '../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../seo/utils/build-page-metadata.util';

import { sudokuDifficultiesPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(sudokuDifficultiesPageMetadata);

const EnglishSudokuDifficultiesPage = () => <SudokuDifficultiesPage locale={DEFAULT_LOCALE} />;

export default EnglishSudokuDifficultiesPage;
