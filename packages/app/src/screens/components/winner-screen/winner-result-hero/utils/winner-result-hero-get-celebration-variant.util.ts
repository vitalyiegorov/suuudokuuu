import { DifficultyEnum } from '@suuudokuuu/generator';

import type { CelebrationPulseVariant } from '../../../../../@generic/components/celebration-pulse/constant/celebration-pulse.constant';

export const winnerResultHeroGetCelebrationVariant = (difficulty: DifficultyEnum): CelebrationPulseVariant => {
    if (difficulty === DifficultyEnum.Infinity) {
        return 'infinity';
    }

    if (difficulty === DifficultyEnum.Hell) {
        return 'hell';
    }

    return 'default';
};
