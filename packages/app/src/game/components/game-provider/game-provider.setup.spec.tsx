import { describe, expect, it, jest } from '@jest/globals';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { use } from 'react';
import { Pressable } from 'react-native';
import { Provider } from 'react-redux';

import { createAppTestStore } from '../../../@generic/utils/create-app-test-store.mock';
import { GameContext } from '../../context/game.context';

import { GameProvider } from './game-provider';

import type { GameSetupInterface } from '../../interface/game-setup.interface';

jest.mock('../../../@generic/app-root.store', () => ({ appRootStore: { dispatch: jest.fn(), getState: jest.fn() } }));

const createTriggerTestID = 'game-provider-create-trigger';

const abandonedAttempt = {
    candidates: { '1-1': [1, 2] },
    challengeState: 'rival-payload',
    challengeTime: 300,
    difficulty: DifficultyEnum.Newbie,
    elapsedTime: 250,
    hasNewPersonalBestScore: true,
    isChallengeRun: false,
    maxMistakes: 99,
    mistakes: 4,
    score: 5000,
    timelineEvents: [{ kind: TimelineEventKindEnum.Away as const, ts: 3 }]
};

interface Props {
    readonly setup: GameSetupInterface;
}

const CreateTrigger = ({ setup }: Props) => {
    const { create } = use(GameContext);

    const handlePress = () => void create(setup);

    return <Pressable onPress={handlePress} testID={createTriggerTestID} />;
};

const startGame = async (setup: GameSetupInterface) => {
    const store = createAppTestStore({ game: abandonedAttempt });

    await render(
        <Provider store={store}>
            <I18nProvider i18n={i18n}>
                <GameProvider>
                    <CreateTrigger setup={setup} />
                </GameProvider>
            </I18nProvider>
        </Provider>
    );

    await fireEvent.press(screen.getByTestId(createTriggerTestID));

    await waitFor(() => void expect(store.getState().game.sudokuString).not.toBe(''));

    return store.getState().game;
};

describe('GameProvider', () => {
    it('starts a Hardcore challenge retry with the requested setup and a clean board', async () => {
        const gameState = await startGame({ difficulty: DifficultyEnum.Hard, isChallengeRun: true, maxMistakes: 0 });

        expect(gameState).toMatchObject({
            candidates: {},
            challengeState: '',
            challengeTime: 0,
            difficulty: DifficultyEnum.Hard,
            elapsedTime: 0,
            hasNewPersonalBestScore: false,
            isChallengeRun: true,
            maxMistakes: 0,
            mistakes: 0,
            score: 0,
            timelineEvents: []
        });
        expect(Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig).Difficulty).toBe(DifficultyEnum.Hard);
    });

    it('starts a normal retry without inheriting challenge identity', async () => {
        const gameState = await startGame({ difficulty: DifficultyEnum.Easy, isChallengeRun: false, maxMistakes: 3 });

        expect(gameState).toMatchObject({ difficulty: DifficultyEnum.Easy, isChallengeRun: false, maxMistakes: 3 });
        expect(Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig).Difficulty).toBe(DifficultyEnum.Easy);
    });
});
