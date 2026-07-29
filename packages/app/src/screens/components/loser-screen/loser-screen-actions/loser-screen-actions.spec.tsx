import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';
import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenActions } from './loser-screen-actions';

import type { GameSetupInterface } from '../../../../game/interface/game-setup.interface';

const homeDefaults = {
    lastGameChallengeMode: true,
    lastGameDifficulty: DifficultyEnum.Newbie,
    lastGameMaxMistakes: 99
};

const retrySetups: GameSetupInterface[] = [
    { difficulty: DifficultyEnum.Easy, isChallengeRun: false, maxMistakes: 3 },
    { difficulty: DifficultyEnum.Hard, isChallengeRun: false, maxMistakes: 0 },
    { difficulty: DifficultyEnum.Nightmare, isChallengeRun: false, maxMistakes: 99 },
    { difficulty: DifficultyEnum.Nightmare, isChallengeRun: true, maxMistakes: 0 }
];

const renderActions = async (retrySetup: GameSetupInterface) => {
    const create = jest.fn();

    await renderWithGameContext(<LoserScreenActions retrySetup={retrySetup} />, { create, settings: homeDefaults });

    return create;
};

describe('LoserScreenActions', () => {
    it.each(retrySetups)(
        'recreates $difficulty with $maxMistakes mistakes and challenge $isChallengeRun on Play again',
        async retrySetup => {
            const create = await renderActions(retrySetup);

            await fireEvent.press(screen.getByTestId(LoserScreenSelectors.PlayAgainButton));

            expect(create).toHaveBeenCalledTimes(1);
            expect(create).toHaveBeenCalledWith({
                difficulty: retrySetup.difficulty,
                isChallengeRun: retrySetup.isChallengeRun,
                maxMistakes: retrySetup.maxMistakes
            });
        }
    );

    it('never falls back to the persisted Home defaults', async () => {
        const retrySetup: GameSetupInterface = { difficulty: DifficultyEnum.Hard, isChallengeRun: false, maxMistakes: 0 };
        const create = await renderActions(retrySetup);

        await fireEvent.press(screen.getByTestId(LoserScreenSelectors.PlayAgainButton));

        expect(create).toHaveBeenCalledWith(retrySetup);
        expect(create).not.toHaveBeenCalledWith(expect.objectContaining({ difficulty: homeDefaults.lastGameDifficulty }));
    });

    it('docks Home beside Play again', async () => {
        await renderActions(retrySetups[0]);

        expect(screen.getByTestId(LoserScreenSelectors.BackHomeButton)).toBeTruthy();
    });
});
