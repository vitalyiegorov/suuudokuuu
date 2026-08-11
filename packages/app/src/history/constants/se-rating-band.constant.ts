import { msg } from '@lingui/core/macro';
import { SE_CHAIN_LENGTH_INCREMENT, SE_CHAIN_RATING_MINIMUM, SE_RATING_CEILING } from '@suuudokuuu/rating';

import { formatSeRatingValue } from '../../@generic/utils/format-se-rating-value.util';

import type { SeRatingBandInterface } from '../interfaces/se-rating-band.interface';

const ExpertBandMaximum = SE_RATING_CEILING - SE_CHAIN_LENGTH_INCREMENT;
const ExpertBandLabel = `${formatSeRatingValue(SE_CHAIN_RATING_MINIMUM, false)}–${formatSeRatingValue(ExpertBandMaximum, false)}`;

export const seRatingBands: readonly SeRatingBandInterface[] = [
    { id: 'foundational', label: '1.0–2.9', nameMessage: msg`Foundational`, minRating: 1.0, maxRating: 2.9 },
    { id: 'intermediate', label: '3.0–4.9', nameMessage: msg`Intermediate`, minRating: 3.0, maxRating: 4.9 },
    { id: 'advanced', label: '5.0–6.5', nameMessage: msg`Advanced`, minRating: 5.0, maxRating: 6.5 },
    {
        id: 'expert',
        label: ExpertBandLabel,
        nameMessage: msg`Expert`,
        minRating: SE_CHAIN_RATING_MINIMUM,
        maxRating: ExpertBandMaximum
    },
    {
        id: 'ceiling',
        label: formatSeRatingValue(SE_RATING_CEILING, true),
        nameMessage: msg`Beyond the ceiling`,
        minRating: SE_RATING_CEILING,
        maxRating: Number.POSITIVE_INFINITY
    }
];
