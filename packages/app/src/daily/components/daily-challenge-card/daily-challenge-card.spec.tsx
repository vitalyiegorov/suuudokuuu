import { describe, expect, it, jest } from '@jest/globals';
import { getDailyDateString, getDailyDayNumber } from '@suuudokuuu/puzzle-forge';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithGameContext } from '../../../@generic/utils/render-with-game-context.mock';
import { GameEmptySudokuStringConstant } from '../../../game/constant/empty-sudoku-string.constant';

import { DailyChallengeCard } from './daily-challenge-card';
import { DailyChallengeCardSelectors } from './daily-challenge-card.selectors';

import type { GameState } from '../../../game/store/game.state';

const todayDayNumber = getDailyDayNumber(getDailyDateString(Date.now()));

const renderCard = async (game: Partial<GameState> = {}, createDaily = jest.fn()) => {
    await renderWithGameContext(<DailyChallengeCard />, { createDaily, game });

    return createDaily;
};

describe('DailyChallengeCard', () => {
    it('offers today’s puzzle on a fresh install', async () => {
        expect.assertions(2);

        await renderCard();

        expect(screen.getByTestId(DailyChallengeCardSelectors.Root)).toBeTruthy();
        expect(screen.queryByTestId(DailyChallengeCardSelectors.Streak)).toBeNull();
    });

    it('starts today’s daily when nothing else is running', async () => {
        expect.assertions(1);

        const createDaily = await renderCard();

        await fireEvent.press(screen.getByTestId(DailyChallengeCardSelectors.Action));

        expect(createDaily).toHaveBeenCalledTimes(1);
    });

    it('shows the current streak once the daily was solved today', async () => {
        expect.assertions(2);

        await renderCard({
            dailyCompletedDayNumbers: [todayDayNumber - 1, todayDayNumber],
            dailyBestStreak: 2
        });

        expect(screen.getByTestId(DailyChallengeCardSelectors.Streak)).toBeTruthy();
        expect(screen.getByTestId(DailyChallengeCardSelectors.BestStreak)).toBeTruthy();
    });

    it('hides the action once today is done so the daily can never be replayed', async () => {
        expect.assertions(1);

        await renderCard({ dailyCompletedDayNumbers: [todayDayNumber] });

        expect(screen.queryByTestId(DailyChallengeCardSelectors.Action)).toBeNull();
    });

    it('offers a fresh daily again after a missed day broke the streak', async () => {
        expect.assertions(3);

        await renderCard({ dailyCompletedDayNumbers: [todayDayNumber - 3], dailyBestStreak: 1 });

        expect(screen.getByTestId(DailyChallengeCardSelectors.Action)).toBeTruthy();
        expect(screen.queryByTestId(DailyChallengeCardSelectors.Streak)).toBeNull();
        expect(screen.getByTestId(DailyChallengeCardSelectors.BestStreak)).toBeTruthy();
    });

    it('resumes instead of restarting while today’s daily is in progress', async () => {
        expect.assertions(2);

        const createDaily = await renderCard({ dailyDayNumber: todayDayNumber, sudokuString: GameEmptySudokuStringConstant });

        await fireEvent.press(screen.getByTestId(DailyChallengeCardSelectors.Action));

        expect(createDaily).not.toHaveBeenCalled();
        expect(screen.getByTestId(DailyChallengeCardSelectors.Action)).toBeTruthy();
    });

    it('keeps yesterday’s unfinished run out of today’s daily slot', async () => {
        expect.assertions(1);

        const createDaily = await renderCard({ dailyDayNumber: todayDayNumber - 1, sudokuString: GameEmptySudokuStringConstant });

        await fireEvent.press(screen.getByTestId(DailyChallengeCardSelectors.Action));

        expect(createDaily).not.toHaveBeenCalled();
    });
});
