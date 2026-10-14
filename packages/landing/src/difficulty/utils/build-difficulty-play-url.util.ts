import { SITE_PLAY_URL } from '../../seo/constants/site.constant';

import type { DifficultyEnum } from '@suuudokuuu/generator';

export const buildDifficultyPlayUrl = (difficulty: DifficultyEnum): string => `${SITE_PLAY_URL}?difficulty=${difficulty}`;
