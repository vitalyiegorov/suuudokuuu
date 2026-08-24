import { i18n } from '@lingui/core';
import { FieldEngine } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { forgeDailyPuzzle, forgePuzzle, getDailyDateString, getDailyDayNumber, getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import { useEffect } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { GameContext } from '../../context/game.context';
import { useGameCreationRunner } from '../../hooks/use-game-creation-runner.hook';
import { useGameEngineState } from '../../hooks/use-game-engine-state.hook';
import { gameLoadAction, gameResumeAction, gameStartAction } from '../../store/game.actions';
import { gameCreateEngine } from '../../utils/game-create-engine.util';

import type { GameSetupInterface } from '../../interface/game-setup.interface';
import type { GameState } from '../../store/game.state';
import type { ForgedPuzzleInterface } from '@suuudokuuu/puzzle-forge';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
    const { dispatch, isCreatingGame, router, runGameCreation, showAlert } = useGameCreationRunner();

    const currentLanguage = useAppSelector(settingsLanguageSelector);

    const [engine, setEngine] = useGameEngineState(showAlert);
    const snapshot = useFieldSnapshot(engine);

    const createFromState = (newState: GameState) =>
        void runGameCreation(() => {
            const needsWallClock = isNotEmptyString(newState.challengeState) || newState.isChallengeRun;
            dispatch(gameLoadAction({ ...newState, ...(needsWallClock && { wallClockStartMs: Date.now() }) }));

            setEngine(gameCreateEngine(newState));

            dispatch(gameResumeAction());

            router.replace('/game');
        });

    const startForgedGame = (
        { sudoku, rating, isRatingCeiling }: ForgedPuzzleInterface,
        setup: Pick<GameState, 'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'maxMistakes'>
    ) => {
        const sudokuString = sudoku.toString();

        setEngine(new FieldEngine({ sudokuString, difficulty: setup.difficulty }));

        dispatch(gameStartAction({ ...setup, sudokuString, rating, isRatingCeiling }));
        router.replace('/game');
    };

    const create = ({ difficulty, isChallengeRun, maxMistakes }: GameSetupInterface) =>
        void runGameCreation(
            () => void startForgedGame(forgePuzzle(difficulty), { difficulty, isChallengeRun, maxMistakes, dailyDayNumber: 0 })
        );

    const createDaily = (maxMistakes: number) =>
        void runGameCreation(() => {
            const dateString = getDailyDateString(Date.now());

            startForgedGame(forgeDailyPuzzle(dateString), {
                difficulty: getDailyDifficulty(dateString),
                isChallengeRun: false,
                maxMistakes,
                dailyDayNumber: getDailyDayNumber(dateString)
            });
        });

    useEffect(() => void i18n.activate(currentLanguage), [currentLanguage]);

    const value = { create, createDaily, createFromState, engine, isCreatingGame, snapshot };

    return <GameContext value={value}>{children}</GameContext>;
};
