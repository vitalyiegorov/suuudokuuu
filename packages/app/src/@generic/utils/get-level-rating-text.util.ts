import { isPositiveNumber } from '@rnw-community/shared';

import { formatSeRatingValue } from './format-se-rating-value.util';

const LevelRatingSeparator = ' · ';

export const getLevelRatingText = (difficultyText: string, rating: number, isCeiling: boolean): string => {
    if (!isPositiveNumber(rating)) {
        return difficultyText;
    }

    return `${difficultyText}${LevelRatingSeparator}${formatSeRatingValue(rating, isCeiling)}`;
};
