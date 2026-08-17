import { SE_RATING_CEILING } from '@suuudokuuu/rating';

import { mixColors } from '../../../../theme/utils/mix-colors.util';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const RatingRampMinRating = 1;
const RatingRampMaxRating = 12;

export const ratingBadgeGetColor = (theme: ThemeInterface, rating: number): string => {
    const clampedRating = Math.min(Math.max(rating, RatingRampMinRating), RatingRampMaxRating);

    if (clampedRating <= SE_RATING_CEILING) {
        const progress = (clampedRating - RatingRampMinRating) / (SE_RATING_CEILING - RatingRampMinRating);

        return mixColors(theme.colors.text.hint, theme.colors.accent, progress);
    }

    const progress = (clampedRating - SE_RATING_CEILING) / (RatingRampMaxRating - SE_RATING_CEILING);

    return mixColors(theme.colors.accent, theme.colors.danger, progress);
};
