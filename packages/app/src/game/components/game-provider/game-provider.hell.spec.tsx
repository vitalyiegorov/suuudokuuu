import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { use } from 'react';
import { Pressable } from 'react-native';
import { Provider } from 'react-redux';

import { appRootStore } from '../../../@generic/app-root.store';
import { hellQueueConsumeAction, hellQueueEnqueueAction } from '../../../hell-queue/store/hell-queue.actions';
import { GameContext } from '../../context/game.context';
import { gameResetAction } from '../../store/game.actions';

import { GameProvider } from './game-provider';

import type { HellQueueEntryInterface } from '../../../hell-queue/interfaces/hell-queue-entry.interface';

const mockAlert = jest.fn();

jest.mock('../../../@generic/components/alert/alert', () => ({ Alert: (title: string, message?: string) => mockAlert(title, message) }));

jest.mock('../../../@generic/app-root.store', () => {
    const { createAppTestStore } = jest.requireActual<typeof import('../../../@generic/utils/create-app-test-store.mock')>(
        '../../../@generic/utils/create-app-test-store.mock'
    );

    return { appRootStore: createAppTestStore() };
});

const createTriggerTestID = 'game-provider-hell-create-trigger';
const hellPuzzle = '070009060090000000280400007000000001009020300000107000000040050000000020018000700';
const hellSolution = '371289465594376218286415937827534691159628374463197582932741856745863129618952743';

const buildHellEntry = (id: string): HellQueueEntryInterface => ({
    createdAt: 1,
    generatorVersion: 1,
    givensCount: 20,
    id,
    puzzle: id,
    schemaVersion: 1,
    solution: hellSolution
});

const firstHellEntry = buildHellEntry(hellPuzzle);

const hellGameSetup = { difficulty: DifficultyEnum.Hell, isChallengeRun: false, maxMistakes: 3 };

const CreateHellGameTrigger = () => {
    const { create } = use(GameContext);

    const handlePress = () => void create(hellGameSetup);

    return <Pressable onPress={handlePress} testID={createTriggerTestID} />;
};

const seedHellQueue = (entries: readonly HellQueueEntryInterface[]) => {
    appRootStore.getState().hellQueue.entries.forEach(entry => appRootStore.dispatch(hellQueueConsumeAction({ id: entry.id })));
    entries.forEach(entry => appRootStore.dispatch(hellQueueEnqueueAction(entry)));
};

const renderHellGame = async (entries: readonly HellQueueEntryInterface[]) => {
    seedHellQueue(entries);

    await render(
        <Provider store={appRootStore}>
            <I18nProvider i18n={i18n}>
                <GameProvider>
                    <CreateHellGameTrigger />
                </GameProvider>
            </I18nProvider>
        </Provider>
    );
};

describe('GameProvider Hell branch', () => {
    beforeEach(() => {
        mockAlert.mockClear();
        appRootStore.dispatch(gameResetAction());
    });

    it('consumes the queued Hell puzzle and starts the game with it', async () => {
        await renderHellGame([firstHellEntry]);

        await fireEvent.press(screen.getByTestId(createTriggerTestID));

        await waitFor(() => void expect(appRootStore.getState().game.sudokuString).not.toBe(''));

        expect(appRootStore.getState().hellQueue.entries).toHaveLength(0);
        expect(appRootStore.getState().game.difficulty).toBe(DifficultyEnum.Hell);

        const startedSudoku = Sudoku.fromString(appRootStore.getState().game.sudokuString, defaultSudokuConfig);
        expect(startedSudoku.Config.difficulty).toBe(DifficultyEnum.Hell);
    });

    it('consumes exactly one entry when the create trigger fires repeatedly before navigation', async () => {
        const secondHellEntry = buildHellEntry(hellPuzzle.replace('7', '1'));
        await renderHellGame([firstHellEntry, secondHellEntry]);

        await fireEvent.press(screen.getByTestId(createTriggerTestID));
        await fireEvent.press(screen.getByTestId(createTriggerTestID));
        await fireEvent.press(screen.getByTestId(createTriggerTestID));

        await waitFor(() => void expect(appRootStore.getState().game.sudokuString).not.toBe(''));

        expect(appRootStore.getState().hellQueue.entries).toHaveLength(1);
        expect(appRootStore.getState().hellQueue.entries[0]).toEqual(secondHellEntry);
    });

    it('shows a non-blocking alert and leaves state untouched when the queue is empty', async () => {
        await renderHellGame([]);

        await fireEvent.press(screen.getByTestId(createTriggerTestID));

        await waitFor(() => void expect(mockAlert).toHaveBeenCalledTimes(1));

        expect(appRootStore.getState().game.sudokuString).toBe('');
        expect(appRootStore.getState().hellQueue.entries).toHaveLength(0);
    });
});
