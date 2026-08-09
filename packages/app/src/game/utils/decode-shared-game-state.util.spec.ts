import { describe, expect, it } from '@jest/globals';
import { SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { initialGameState } from '../store/game.state';

import { decodeSharedGameState } from './decode-shared-game-state.util';
import { gameStateToString } from './game-state-to-string.util';

import type { GameState } from '../store/game.state';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givensMask = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const ComputedRating = 4.4;

const buildGameState = (): GameState => ({
    ...initialGameState,
    sudokuString: solvedBoard,
    timelineEvents: solvedBoard
        .split('')
        .map((value, cellIndex) => ({ kind: TimelineEventKindEnum.Cell as const, cellIndex, value: parseInt(value, 10), ts: 10 }))
        .filter(event => givensMask.charAt(event.cellIndex) === '.'),
    maxMistakes: 3
});

describe('decodeSharedGameState', () => {
    it.each([SharedPayloadKindEnum.Puzzle, SharedPayloadKindEnum.Challenge, SharedPayloadKindEnum.Handoff])(
        'should report the payload kind of a %s share',
        kind => {
            expect.assertions(2);

            const decoded = decodeSharedGameState(gameStateToString(buildGameState(), kind));

            expect(decoded.kind).toBe(kind);
            expect(decoded.isReadable).toBe(true);
        }
    );

    it('should preserve the computed rating of a decoded shared payload', () => {
        expect.assertions(2);

        const ratedState: GameState = { ...buildGameState(), rating: ComputedRating, isRatingCeiling: false };
        const decoded = decodeSharedGameState(gameStateToString(ratedState, SharedPayloadKindEnum.Puzzle));

        expect(decoded.gameState.rating).toBe(ComputedRating);
        expect(decoded.gameState.isRatingCeiling).toBe(false);
    });

    it('should report an unreadable payload as a puzzle with the initial state', () => {
        expect.assertions(3);

        const decoded = decodeSharedGameState('not-a-valid-share-link');

        expect(decoded.isReadable).toBe(false);
        expect(decoded.kind).toBe(SharedPayloadKindEnum.Puzzle);
        expect(decoded.gameState).toEqual(initialGameState);
    });
});
