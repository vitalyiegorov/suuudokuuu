import { InfinitySudokuPage } from '../../../../difficulty/components/infinity-sudoku-page/infinity-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { infinitySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(infinitySudokuPageMetadata);

const EnglishInfinitySudokuPage = () => <InfinitySudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishInfinitySudokuPage;
