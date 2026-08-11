import { isDefined } from '@rnw-community/shared';

import { seRatingBands } from '../constants/se-rating-band.constant';

import type { SeRatingBandInterface } from '../interfaces/se-rating-band.interface';

export const getSeRatingBand = (rating: number): SeRatingBandInterface | null => {
    const band = seRatingBands.find(candidate => rating >= candidate.minRating && rating <= candidate.maxRating);

    return isDefined(band) ? band : null;
};
