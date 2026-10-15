import { EasySudokuPage } from '../../../../difficulty/components/easy-sudoku-page/easy-sudoku-page';
import { DEFAULT_LOCALE } from '../../../../seo/constants/site.constant';
import { buildPageMetadata } from '../../../../seo/utils/build-page-metadata.util';

import { easySudokuPageMetadata } from './metadata';

import type { Metadata } from 'next';

export const metadata: Metadata = buildPageMetadata(easySudokuPageMetadata);

const EnglishEasySudokuPage = () => <EasySudokuPage locale={DEFAULT_LOCALE} />;

export default EnglishEasySudokuPage;
