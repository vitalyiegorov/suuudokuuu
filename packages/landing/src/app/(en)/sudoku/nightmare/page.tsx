import { NightmareSudokuPage } from '../../../../difficulty/components/nightmare-sudoku-page/nightmare-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { nightmareSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(nightmareSudokuPageMetadata);

const EnglishNightmareSudokuPage = () => <NightmareSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishNightmareSudokuPage;
