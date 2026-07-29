import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { fireEvent, screen } from '@testing-library/react-native';

import { PlayAgainButtonSelectors } from '../../../../@generic/components/play-again-button/play-again-button.selectors';
import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';
import { initialGameState } from '../../../../game/store/game.state';
import { WinnerScreenSelectors } from '../winner-screen.selectors';

import { WinnerScreenActions } from './winner-screen-actions';

import type { GameSetupInterface } from '../../../../game/interface/game-setup.interface';
import type { GameState } from '../../../../game/store/game.state';

const boardCellCount = 81;

const homeDefaults = {
    lastGameChallengeMode: true,
    lastGameDifficulty: DifficultyEnum.Newbie,
    lastGameMaxMistakes: 99
};

interface CompletedAttemptCase {
    readonly challengeState: string;
    readonly name: string;
    readonly playAgainTestID: string;
    readonly retrySetup: GameSetupInterface;
}

const completedAttempts: CompletedAttemptCase[] = [
    {
        challengeState: '',
        name: 'Easy with the standard mistake allowance',
        playAgainTestID: WinnerScreenSelectors.PlayAgainButton,
        retrySetup: { difficulty: DifficultyEnum.Easy, isChallengeRun: false, maxMistakes: 3 }
    },
    {
        challengeState: '',
        name: 'Hard in Hardcore',
        playAgainTestID: WinnerScreenSelectors.PlayAgainButton,
        retrySetup: { difficulty: DifficultyEnum.Hard, isChallengeRun: false, maxMistakes: 0 }
    },
    {
        challengeState: '',
        name: 'Nightmare with a custom mistake allowance',
        playAgainTestID: WinnerScreenSelectors.PlayAgainButton,
        retrySetup: { difficulty: DifficultyEnum.Nightmare, isChallengeRun: false, maxMistakes: 99 }
    },
    {
        challengeState: '',
        name: 'a self-authored challenge',
        playAgainTestID: WinnerScreenSelectors.PlayAgainButton,
        retrySetup: { difficulty: DifficultyEnum.Nightmare, isChallengeRun: true, maxMistakes: 0 }
    },
    {
        challengeState: 'rival-challenge-payload',
        name: 'an accepted rival challenge',
        playAgainTestID: PlayAgainButtonSelectors.Root,
        retrySetup: { difficulty: DifficultyEnum.Medium, isChallengeRun: true, maxMistakes: 3 }
    }
];

const renderActions = async (completedAttempt: CompletedAttemptCase) => {
    const create = jest.fn();
    const gameState: GameState = {
        ...initialGameState,
        challengeState: completedAttempt.challengeState,
        difficulty: completedAttempt.retrySetup.difficulty,
        isChallengeRun: completedAttempt.retrySetup.isChallengeRun,
        maxMistakes: completedAttempt.retrySetup.maxMistakes,
        score: 1234,
        sudokuString: '1'.repeat(boardCellCount)
    };

    await renderWithGameContext(<WinnerScreenActions gameState={gameState} retrySetup={completedAttempt.retrySetup} />, {
        create,
        settings: homeDefaults
    });

    return create;
};

describe('WinnerScreenActions', () => {
    it.each(completedAttempts)('recreates $name on Play again', async completedAttempt => {
        const create = await renderActions(completedAttempt);

        await fireEvent.press(screen.getByTestId(completedAttempt.playAgainTestID));

        expect(create).toHaveBeenCalledTimes(1);
        expect(create).toHaveBeenCalledWith({
            difficulty: completedAttempt.retrySetup.difficulty,
            isChallengeRun: completedAttempt.retrySetup.isChallengeRun,
            maxMistakes: completedAttempt.retrySetup.maxMistakes
        });
    });

    it('never falls back to the persisted Home defaults', async () => {
        const create = await renderActions(completedAttempts[1]);

        await fireEvent.press(screen.getByTestId(WinnerScreenSelectors.PlayAgainButton));

        expect(create).not.toHaveBeenCalledWith(expect.objectContaining({ difficulty: homeDefaults.lastGameDifficulty }));
        expect(create).not.toHaveBeenCalledWith(expect.objectContaining({ isChallengeRun: homeDefaults.lastGameChallengeMode }));
        expect(create).not.toHaveBeenCalledWith(expect.objectContaining({ maxMistakes: homeDefaults.lastGameMaxMistakes }));
    });
});
