import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { historyGetRatingBandCounts } from './history-get-rating-band-counts.util';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';

const FoundationalBandRating = 1.5;
const IntermediateBandRating = 3.0;
const AdvancedBandRating = 5.6;
const ExpertBandLowRating = 6.6;
const ExpertBandHighRating = 8.2;
const CeilingBandRating = 8.5;

const buildCompletedGame = (rating: number, isRatingCeiling = false): CompletedGameInterface => ({
    completedAt: 1,
    difficulty: DifficultyEnum.Easy,
    rating,
    isRatingCeiling,
    elapsedTime: 100,
    encodedState: '',
    maxMistakes: 3,
    mistakes: 0,
    score: 500
});

describe('historyGetRatingBandCounts', () => {
    it('should return a zero count for every band when there are no completed games', () => {
        expect.assertions(1);

        const bandCounts = historyGetRatingBandCounts([]);

        expect(bandCounts.every(entry => entry.count === 0)).toBe(true);
    });

    it('should exclude rating-0 games from every band', () => {
        expect.assertions(1);

        const bandCounts = historyGetRatingBandCounts([buildCompletedGame(0)]);

        expect(bandCounts.every(entry => entry.count === 0)).toBe(true);
    });

    it('should bucket completed games into their SE difficulty band', () => {
        expect.assertions(5);

        const bandCounts = historyGetRatingBandCounts([
            buildCompletedGame(FoundationalBandRating),
            buildCompletedGame(IntermediateBandRating),
            buildCompletedGame(AdvancedBandRating),
            buildCompletedGame(ExpertBandLowRating),
            buildCompletedGame(ExpertBandHighRating),
            buildCompletedGame(CeilingBandRating, true)
        ]);
        const countById = new Map(bandCounts.map(entry => [entry.band.id, entry.count]));

        expect(countById.get('foundational')).toBe(1);
        expect(countById.get('intermediate')).toBe(1);
        expect(countById.get('advanced')).toBe(1);
        expect(countById.get('expert')).toBe(2);
        expect(countById.get('ceiling')).toBe(1);
    });
});
