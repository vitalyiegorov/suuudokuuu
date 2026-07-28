import { describe, expect, it } from '@jest/globals';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { initialGameState } from '../../game/store/game.state';
import { createAppTestStore } from '../utils/create-app-test-store.mock';

import { useCompletedGameResult } from './use-completed-game-result.hook';

import type { GameState } from '../../game/store/game.state';

const newbieBoard = () => {
    const sudoku = new Sudoku(defaultSudokuConfig);

    sudoku.create(DifficultyEnum.Newbie);

    return sudoku.toString();
};

const completedHardcoreChallenge = (sudokuString: string): Partial<GameState> => ({
    candidates: { '1-1': [1, 2] },
    difficulty: DifficultyEnum.Hard,
    elapsedTime: 125,
    isChallengeRun: true,
    maxMistakes: 0,
    mistakes: 3,
    score: 7777,
    sudokuString,
    timelineEvents: [{ kind: TimelineEventKindEnum.Away as const, ts: 4 }]
});

const renderCompletedGameResult = async (game: Partial<GameState>) => {
    const store = createAppTestStore({ game });
    const results: ReturnType<typeof useCompletedGameResult>[] = [];

    const CompletedGameResultProbe = () => {
        results.push(useCompletedGameResult());

        return null;
    };

    await render(
        <Provider store={store}>
            <I18nProvider i18n={i18n}>
                <CompletedGameResultProbe />
            </I18nProvider>
        </Provider>
    );

    return { results, store };
};

describe('useCompletedGameResult', () => {
    it('snapshots the completed run setup instead of re-deriving it from the board', async () => {
        const sudokuString = newbieBoard();
        const { results } = await renderCompletedGameResult(completedHardcoreChallenge(sudokuString));
        const [completedGameResult] = results;

        expect(Sudoku.fromString(sudokuString, defaultSudokuConfig).Difficulty).toBe(DifficultyEnum.Newbie);
        expect(completedGameResult).toMatchObject({
            difficultyText: 'Hard',
            kind: 'ready',
            mistakesTypeText: 'Hardcore',
            retrySetup: { difficulty: DifficultyEnum.Hard, isChallengeRun: true, maxMistakes: 0 }
        });
    });

    it('resets every per-attempt value in the store while keeping the snapshot intact', async () => {
        const { results, store } = await renderCompletedGameResult(completedHardcoreChallenge(newbieBoard()));
        const [completedGameResult] = results;
        const resetGameState = store.getState().game;

        expect(resetGameState).toMatchObject({
            candidates: {},
            elapsedTime: 0,
            mistakes: 0,
            score: 0,
            sudokuString: '',
            timelineEvents: []
        });
        expect(completedGameResult).toMatchObject({
            retrySetup: { difficulty: DifficultyEnum.Hard, isChallengeRun: true, maxMistakes: 0 }
        });
    });

    it('redirects when no attempt was played', async () => {
        const { results } = await renderCompletedGameResult({ ...initialGameState });

        expect(results[0]).toEqual({ kind: 'redirect' });
    });

    it('redirects when the completed board cannot be parsed', async () => {
        const { results } = await renderCompletedGameResult({ ...completedHardcoreChallenge('not-a-board') });

        expect(results[0]).toEqual({ kind: 'redirect' });
    });
});
