import { NewbieSudokuPage } from '../../../../difficulty/components/newbie-sudoku-page/newbie-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { newbieSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(newbieSudokuPageMetadata);

const EnglishNewbieSudokuPage = () => <NewbieSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishNewbieSudokuPage;
