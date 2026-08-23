import { describe, expect, it, jest } from '@jest/globals';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { getDailyDateString, getDailyDayNumber, getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { use } from 'react';
import { Pressable } from 'react-native';
import { Provider } from 'react-redux';

import { createAppTestStore } from '../../../@generic/utils/create-app-test-store.mock';
import { GameContext } from '../../context/game.context';

import { GameProvider } from './game-provider';

jest.mock('../../../@generic/app-root.store', () => ({ appRootStore: { dispatch: jest.fn(), getState: jest.fn() } }));

const createDailyTriggerTestID = 'game-provider-create-daily-trigger';
const StandardMaxMistakes = 3;
const DailyForgeTimeoutMs = 120_000;

const todayDateString = getDailyDateString(Date.now());

const CreateDailyTrigger = () => {
    const { createDaily } = use(GameContext);

    const handlePress = () => void createDaily(StandardMaxMistakes);

    return <Pressable onPress={handlePress} testID={createDailyTriggerTestID} />;
};

const startDailyGame = async () => {
    const store = createAppTestStore();

    await render(
        <Provider store={store}>
            <I18nProvider i18n={i18n}>
                <GameProvider>
                    <CreateDailyTrigger />
                </GameProvider>
            </I18nProvider>
        </Provider>
    );

    await fireEvent.press(screen.getByTestId(createDailyTriggerTestID));

    await waitFor(() => void expect(store.getState().game.sudokuString).not.toBe(''));

    return store.getState().game;
};

describe('GameProvider daily challenge', () => {
    it(
        'starts today’s daily on the rotated tier and pins the run to today',
        async () => {
            const gameState = await startDailyGame();

            expect(gameState).toMatchObject({
                dailyDayNumber: getDailyDayNumber(todayDateString),
                difficulty: getDailyDifficulty(todayDateString),
                isChallengeRun: false,
                maxMistakes: StandardMaxMistakes
            });
            expect(gameState.rating).toBeGreaterThan(0);
        },
        DailyForgeTimeoutMs
    );

    it(
        'serves the identical board to every device asking on the same UTC date',
        async () => {
            const first = await startDailyGame();
            const second = await startDailyGame();

            expect(first.sudokuString).toBe(second.sudokuString);
        },
        DailyForgeTimeoutMs
    );
});
