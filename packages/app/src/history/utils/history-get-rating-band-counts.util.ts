import { seRatingBands } from '../constants/se-rating-band.constant';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';
import type { SeRatingBandCountInterface } from '../interfaces/se-rating-band-count.interface';

export const historyGetRatingBandCounts = (completedGames: readonly CompletedGameInterface[]): readonly SeRatingBandCountInterface[] =>
    seRatingBands.map(band => ({
        band,
        count: completedGames.filter(
            completedGame => completedGame.rating > 0 && completedGame.rating >= band.minRating && completedGame.rating <= band.maxRating
        ).length
    }));
