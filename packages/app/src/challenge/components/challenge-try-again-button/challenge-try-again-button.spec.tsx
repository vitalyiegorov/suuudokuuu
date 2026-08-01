import { describe, expect, it, jest } from '@jest/globals';
import { SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithGameContext } from '../../../@generic/utils/render-with-game-context.mock';
import { initialGameState } from '../../../game/store/game.state';
import { gameStateToString } from '../../../game/utils/game-state-to-string.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';

import { ChallengeTryAgainButton } from './challenge-try-again-button';
import { ChallengeTryAgainButtonSelectors } from './challenge-try-again-button.selectors';

import type { GameState } from '../../../game/store/game.state';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givensMask = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const buildRivalChallengeState = (): string => {
    const timelineEvents = solvedBoard
        .split('')
        .flatMap((value, cellIndex) =>
            givensMask.charAt(cellIndex) === '.'
                ? [{ kind: TimelineEventKindEnum.Cell as const, cellIndex, value: parseInt(value, 10), ts: 10 }]
                : []
        );

    return gameStateToString(
        { ...initialGameState, maxMistakes: 0, sudokuString: solvedBoard, timelineEvents },
        SharedPayloadKindEnum.Challenge
    );
};

describe('ChallengeTryAgainButton', () => {
    it('rebuilds the accepted rival run from the rival payload', async () => {
        const challengeState = buildRivalChallengeState();
        const playerGameState: GameState = {
            ...initialGameState,
            challengeState,
            difficulty: DifficultyEnum.Nightmare,
            elapsedTime: 400,
            maxMistakes: 0,
            mistakes: 3,
            score: 999,
            sudokuString: givensMask
        };
        const createFromState = jest.fn();

        await renderWithGameContext(<ChallengeTryAgainButton gameState={playerGameState} />, { createFromState });

        await fireEvent.press(screen.getByTestId(ChallengeTryAgainButtonSelectors.Root));

        expect(createFromState).toHaveBeenCalledWith(stringToGameState(challengeState));
        expect(createFromState).toHaveBeenCalledWith(
            expect.objectContaining({
                challengeState,
                difficulty: DifficultyEnum.Nightmare,
                isChallengeRun: true,
                maxMistakes: 0,
                mistakes: 0,
                score: 0
            })
        );
    });
});
