import { MediumSudokuPage } from '../../../../difficulty/components/medium-sudoku-page/medium-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { mediumSudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(mediumSudokuPageMetadata);

const EnglishMediumSudokuPage = () => <MediumSudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishMediumSudokuPage;
