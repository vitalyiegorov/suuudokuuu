import { SE_RATING_CEILING } from '@suuudokuuu/rating';

import { parseColor } from '../../../../theme/utils/parse-color.util';

import type { ParsedColorInterface } from '../../../../theme/utils/parse-color.util';
import type { ThemeInterface } from '@suuudokuuu/ui/theme';

const RatingRampMinRating = 1;
const RatingRampMaxRating = 12;
const OpaqueBlack: ParsedColorInterface = { red: 0, green: 0, blue: 0, alpha: 1 };

const lerpChannel = (start: number, end: number, progress: number): number => start + (end - start) * progress;

const mixColors = (fromColor: string, toColor: string, progress: number): string => {
    const from = parseColor(fromColor) ?? OpaqueBlack;
    const to = parseColor(toColor) ?? OpaqueBlack;

    const red = Math.round(lerpChannel(from.red, to.red, progress));
    const green = Math.round(lerpChannel(from.green, to.green, progress));
    const blue = Math.round(lerpChannel(from.blue, to.blue, progress));
    const alpha = lerpChannel(from.alpha, to.alpha, progress);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export const ratingBadgeGetColor = (theme: ThemeInterface, rating: number): string => {
    const clampedRating = Math.min(Math.max(rating, RatingRampMinRating), RatingRampMaxRating);

    if (clampedRating <= SE_RATING_CEILING) {
        const progress = (clampedRating - RatingRampMinRating) / (SE_RATING_CEILING - RatingRampMinRating);

        return mixColors(theme.colors.text.hint, theme.colors.accent, progress);
    }

    const progress = (clampedRating - SE_RATING_CEILING) / (RatingRampMaxRating - SE_RATING_CEILING);

    return mixColors(theme.colors.accent, theme.colors.danger, progress);
};
