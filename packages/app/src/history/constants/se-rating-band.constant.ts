import { SE_RATING_CEILING } from '@suuudokuuu/rating';

import type { SeRatingBandInterface } from '../interfaces/se-rating-band.interface';

export const seRatingBands: readonly SeRatingBandInterface[] = [
    { id: 'foundational', label: '1.0–2.9', minRating: 1.0, maxRating: 2.9 },
    { id: 'intermediate', label: '3.0–4.9', minRating: 3.0, maxRating: 4.9 },
    { id: 'advanced', label: '5.0–6.5', minRating: 5.0, maxRating: 6.5 },
    { id: 'expert', label: '6.6–8.4', minRating: 6.6, maxRating: 8.4 },
    { id: 'ceiling', label: `${SE_RATING_CEILING.toFixed(1)}+`, minRating: SE_RATING_CEILING, maxRating: Number.POSITIVE_INFINITY }
];
