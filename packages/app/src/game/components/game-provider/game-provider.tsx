import { i18n } from '@lingui/core';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { useEffect, useState } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { GameContext } from '../../context/game.context';
import { useGameCreationRunner } from '../../hooks/use-game-creation-runner.hook';
import { gameLoadAction, gameResumeAction, gameStartAction } from '../../store/game.actions';
import { gameSudokuStringSelector } from '../../store/game.selectors';
import { gameProviderCreateHellGame } from '../../utils/game-provider-create-hell-game.util';

import type { GameSetupInterface } from '../../interface/game-setup.interface';
import type { GameState } from '../../store/game.state';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const createSudokuByDifficulty = (difficulty: DifficultyEnum): Sudoku => {
    if (difficulty === DifficultyEnum.Hell) {
        return gameProviderCreateHellGame();
    }

    const newSudoku = new Sudoku(defaultSudokuConfig);

    newSudoku.create(difficulty);

    return newSudoku;
};

export const GameProvider = ({ children }: Props) => {
    const { dispatch, isCreatingGame, router, runGameCreation, showAlert } = useGameCreationRunner();

    const currentGameString = useAppSelector(gameSudokuStringSelector);
    const currentLanguage = useAppSelector(settingsLanguageSelector);

    const [sudoku, setSudoku] = useState(() => {
        if (isNotEmptyString(currentGameString)) {
            try {
                return Sudoku.fromString(currentGameString, defaultSudokuConfig);
            } catch (error: unknown) {
                showAlert(error);
            }
        }

        return new Sudoku(defaultSudokuConfig);
    });

    const createFromState = (newState: GameState) =>
        void runGameCreation(() => {
            const needsWallClock = isNotEmptyString(newState.challengeState) || newState.isChallengeRun;
            dispatch(gameLoadAction({ ...newState, ...(needsWallClock && { wallClockStartMs: Date.now() }) }));

            setSudoku(Sudoku.fromString(newState.sudokuString, defaultSudokuConfig));

            dispatch(gameResumeAction());

            router.replace('/game');
        });

    const create = ({ difficulty, isChallengeRun, maxMistakes }: GameSetupInterface) =>
        void runGameCreation(() => {
            const newSudoku = createSudokuByDifficulty(difficulty);

            setSudoku(newSudoku);

            const sudokuString = newSudoku.toString();
            dispatch(gameStartAction({ difficulty, isChallengeRun, maxMistakes, sudokuString }));
            router.push('/game');
        });

    useEffect(() => void i18n.activate(currentLanguage), [currentLanguage]);

    const value = { create, createFromState, isCreatingGame, sudoku };

    return <GameContext value={value}>{children}</GameContext>;
};
