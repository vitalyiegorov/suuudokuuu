import { isPositiveNumber } from '@rnw-community/shared';

const RatingDecimalPlaces = 1;
const RatingCeilingSuffix = '+';
const LevelRatingSeparator = ' · ';

export const getLevelRatingText = (difficultyText: string, rating: number, isCeiling: boolean): string => {
    if (!isPositiveNumber(rating)) {
        return difficultyText;
    }

    const ratingText = `${rating.toFixed(RatingDecimalPlaces)}${isCeiling ? RatingCeilingSuffix : ''}`;

    return `${difficultyText}${LevelRatingSeparator}${ratingText}`;
};
