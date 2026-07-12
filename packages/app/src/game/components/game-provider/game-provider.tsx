import { i18n } from '@lingui/core';
import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { getErrorMessage, isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { GameContext } from '../../context/game.context';
import { gameLoadAction, gameResetAction, gameResumeAction, gameStartAction } from '../../store/game.actions';
import { gameSudokuStringSelector } from '../../store/game.selectors';

import type { GameState } from '../../store/game.state';
import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useLingui();

    const currentGameString = useAppSelector(gameSudokuStringSelector);
    const currentLanguage = useAppSelector(settingsLanguageSelector);

    const showAlert = (error: unknown) => {
        Alert(t`Invalid Sudoku`, getErrorMessage(error), [
            {
                onPress: () => {
                    dispatch(gameResetAction());
                    router.replace('/');
                },
                text: t`OK`
            }
        ]);
    };

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

    const createFromState = (newState: GameState) => {
        try {
            dispatch(gameLoadAction(newState));

            setSudoku(Sudoku.fromString(newState.sudokuString, defaultSudokuConfig));

            dispatch(gameResumeAction());

            router.replace('/game');

            return true;
        } catch (error) {
            showAlert(error);

            return false;
        }
    };

    const create = (difficulty: DifficultyEnum, maxMistakes: number) => {
        const newSudoku = new Sudoku(defaultSudokuConfig);

        newSudoku.create(difficulty);
        setSudoku(newSudoku);

        const sudokuString = newSudoku.toString();
        dispatch(gameStartAction({ maxMistakes, sudokuString }));
        router.push('/game');
    };

    useEffect(() => void i18n.activate(currentLanguage), [currentLanguage]);

    const value = { create, createFromState, sudoku };

    return <GameContext value={value}>{children}</GameContext>;
};
