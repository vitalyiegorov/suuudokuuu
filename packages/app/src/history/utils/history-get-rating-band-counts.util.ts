import { isPositiveNumber } from '@rnw-community/shared';

import { seRatingBands } from '../constants/se-rating-band.constant';

import { getSeRatingBand } from './get-se-rating-band.util';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { SeRatingBandCountInterface } from '../interfaces/se-rating-band-count.interface';

export const historyGetRatingBandCounts = (completedGames: readonly CompletedGameInterface[]): readonly SeRatingBandCountInterface[] =>
    seRatingBands.map(band => ({
        band,
        count: completedGames.filter(
            completedGame => isPositiveNumber(completedGame.rating) && getSeRatingBand(completedGame.rating)?.id === band.id
        ).length
    }));
