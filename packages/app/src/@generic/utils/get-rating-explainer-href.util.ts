import { formatSeRatingValue } from './format-se-rating-value.util';

export const RatingExplainerCeilingParamValue = '1';
const NotCeilingParamValue = '0';

export const getRatingExplainerHref = (rating: number, isCeiling: boolean) => ({
    pathname: '/rating-explainer/[rating]' as const,
    params: {
        rating: formatSeRatingValue(rating, false),
        isCeiling: isCeiling ? RatingExplainerCeilingParamValue : NotCeilingParamValue
    }
});
