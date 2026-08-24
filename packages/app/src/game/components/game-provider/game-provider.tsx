import { i18n } from '@lingui/core';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { ratePuzzle } from '@suuudokuuu/rating';
import { useEffect, useState } from 'react';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { GameContext } from '../../context/game.context';
import { useGameCreationRunner } from '../../hooks/use-game-creation-runner.hook';
import { gameLoadAction, gameResumeAction, gameStartAction } from '../../store/game.actions';
import { gameSudokuStringSelector } from '../../store/game.selectors';
import { gameProviderCreateHellGame } from '../../utils/game-provider-create-hell-game.util';
import { gameProviderCreateInfinityGame } from '../../utils/game-provider-create-infinity-game.util';

import type { GameSetupInterface } from '../../interface/game-setup.interface';
import type { RatedGameInterface } from '../../interface/rated-game.interface';
import type { GameState } from '../../store/game.state';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const createCorpusGame = (difficulty: DifficultyEnum): RatedGameInterface | null => {
    if (difficulty === DifficultyEnum.Hell) {
        return gameProviderCreateHellGame();
    }

    if (difficulty === DifficultyEnum.Infinity) {
        return gameProviderCreateInfinityGame();
    }

    return null;
};

const createGeneratedSudoku = (difficulty: DifficultyEnum): Sudoku => {
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

    const restore = (restoredSudokuString: string) => {
        try {
            setSudoku(Sudoku.fromString(restoredSudokuString, defaultSudokuConfig));
        } catch (error: unknown) {
            showAlert(error);
        }
    };

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
            const corpusGame = createCorpusGame(difficulty);
            const newSudoku = corpusGame?.sudoku ?? createGeneratedSudoku(difficulty);

            setSudoku(newSudoku);

            const sudokuString = newSudoku.toString();
            const { rating, isCeiling } = isDefined(corpusGame)
                ? { rating: corpusGame.rating, isCeiling: false }
                : ratePuzzle(sudokuString);

            dispatch(gameStartAction({ difficulty, isChallengeRun, maxMistakes, sudokuString, rating, isRatingCeiling: isCeiling }));
            router.replace('/game');
        });

    useEffect(() => void i18n.activate(currentLanguage), [currentLanguage]);

    const value = { create, createFromState, restore, isCreatingGame, sudoku };

    return <GameContext value={value}>{children}</GameContext>;
};
