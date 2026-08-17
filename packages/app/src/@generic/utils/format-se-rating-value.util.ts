import { isPositiveNumber } from '@rnw-community/shared';

const RatingDecimalPlaces = 1;
const RatingCeilingSuffix = '+';

export const formatSeRatingValue = (rating: number, isCeiling: boolean): string =>
    isPositiveNumber(rating) ? `${rating.toFixed(RatingDecimalPlaces)}${isCeiling ? RatingCeilingSuffix : ''}` : '';
