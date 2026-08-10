import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { initialGameState } from '../../game/store/game.state';

import { getReplayPaceStats } from './get-replay-pace-stats.util';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';

const TotalRunSeconds = 25;
const PlacementCount = 3;
const LongestPauseSeconds = 15;
const AwaySeconds = 10;
const MistakesCount = 2;

const buildCompletedGame = (overrides: Partial<CompletedGameInterface> = {}): CompletedGameInterface => ({
    completedAt: 0,
    difficulty: DifficultyEnum.Easy,
    rating: 0,
    isRatingCeiling: false,
    elapsedTime: TotalRunSeconds,
    encodedState: '',
    maxMistakes: 3,
    mistakes: MistakesCount,
    score: 500,
    ...overrides
});

describe('getReplayPaceStats', () => {
    it('should derive pace and behavior stats from the full run timeline', () => {
        expect.assertions(7);

        const gameState = {
            ...initialGameState,
            challengeTimelineEvents: [
                { kind: TimelineEventKindEnum.Cell as const, cellIndex: 0, value: 1, ts: 5 },
                { kind: TimelineEventKindEnum.Away as const, ts: 2 },
                { kind: TimelineEventKindEnum.Return as const, ts: 10 },
                { kind: TimelineEventKindEnum.Cell as const, cellIndex: 1, value: 2, ts: 3 },
                { kind: TimelineEventKindEnum.Pencil as const, cellIndex: 2, value: 3, ts: 1 },
                { kind: TimelineEventKindEnum.AutoCandidates as const, ts: 0 },
                { kind: TimelineEventKindEnum.Cell as const, cellIndex: 3, value: 4, ts: 4 }
            ]
        };
        const completedGame = buildCompletedGame();

        const paceStats = getReplayPaceStats(gameState, completedGame);

        expect(paceStats.totalTimeSeconds).toBe(TotalRunSeconds);
        expect(paceStats.averageSecondsPerPlacement).toBeCloseTo(TotalRunSeconds / PlacementCount);
        expect(paceStats.longestPauseSeconds).toBe(LongestPauseSeconds);
        expect(paceStats.awaySeconds).toBe(AwaySeconds);
        expect(paceStats.pencilCount).toBe(1);
        expect(paceStats.autoCandidatesUsed).toBe(true);
        expect(paceStats.mistakesCount).toBe(MistakesCount);
    });

    it('should return zeroed pacing stats and no auto-candidates usage for a run with no placements', () => {
        expect.assertions(4);

        const completedGame = buildCompletedGame({ elapsedTime: 0, mistakes: 0 });

        const paceStats = getReplayPaceStats(initialGameState, completedGame);

        expect(paceStats.averageSecondsPerPlacement).toBe(0);
        expect(paceStats.longestPauseSeconds).toBe(0);
        expect(paceStats.autoCandidatesUsed).toBe(false);
        expect(paceStats.pencilCount).toBe(0);
    });
});
