import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { SudokuScoring } from '../../scoring/classes/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';

import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

import type { GameState } from './game.state';

const { hint } = gameSlice.actions;

const eliminationCell = { x: 4, y: 2, value: 0, group: 1 };

const buildRun = (overrides: Partial<GameState> = {}): GameState => ({
    ...initialGameState,
    sudokuString: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',
    difficulty: DifficultyEnum.Medium,
    maxMistakes: 3,
    score: 500,
    elapsedTime: 30,
    ...overrides
});

const expectedPenalty = new SudokuScoring(defaultScoringConfig).calculateHintPenalty({
    difficulty: DifficultyEnum.Medium,
    maxMistakes: 3
});

describe('gameSlice hint', () => {
    it('should deduct the hint penalty from the run score', () => {
        expect.assertions(2);

        const state = gameSlice.reducer(buildRun(), hint({ eliminations: [] }));

        expect(expectedPenalty).toBeGreaterThan(0);
        expect(state.score).toBe(500 - expectedPenalty);
    });

    it('should never push the score below zero', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun({ score: 1 }), hint({ eliminations: [] }));

        expect(state.score).toBe(0);
    });

    it('should record a hint timeline event with the think time delta', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun(), hint({ eliminations: [] }));

        expect(state.timelineEvents).toStrictEqual([{ kind: TimelineEventKindEnum.Hint, ts: 30 }]);
    });

    it('should mirror the applied eliminations into the persisted candidates', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(
            buildRun({ candidates: { '2-4': [1, 3, 7] } }),
            hint({ eliminations: [{ cell: eliminationCell, value: 3 }] })
        );

        expect(state.candidates['2-4']).toStrictEqual([1, 7]);
    });

    it('should leave cells without notes untouched', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun(), hint({ eliminations: [{ cell: eliminationCell, value: 3 }] }));

        expect(state.candidates).toStrictEqual({});
    });

    it('should scale the penalty with the run difficulty', () => {
        expect.assertions(1);

        const mediumState = gameSlice.reducer(buildRun(), hint({ eliminations: [] }));
        const hellState = gameSlice.reducer(buildRun({ difficulty: DifficultyEnum.Hell }), hint({ eliminations: [] }));

        expect(hellState.score).toBeLessThan(mediumState.score);
    });
});
