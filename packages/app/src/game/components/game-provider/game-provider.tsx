import { i18n } from '@lingui/core';
import { FieldEngine } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { forgePuzzle } from '@suuudokuuu/puzzle-forge';
import { useEffect } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { GameContext } from '../../context/game.context';
import { useGameCreationRunner } from '../../hooks/use-game-creation-runner.hook';
import { useGameEngineState } from '../../hooks/use-game-engine-state.hook';
import { gameLoadAction, gameResumeAction, gameStartAction } from '../../store/game.actions';

import type { GameSetupInterface } from '../../interface/game-setup.interface';
import type { GameState } from '../../store/game.state';
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

            setEngine(
                new FieldEngine({
                    sudokuString: newState.sudokuString,
                    difficulty: newState.difficulty,
                    candidates: newState.candidates,
                    inputMode: newState.inputMode,
                    showAutoCandidates: newState.showAutoCandidates,
                    mistakes: newState.mistakes
                })
            );

            dispatch(gameResumeAction());

            router.replace('/game');
        });

    const create = ({ difficulty, isChallengeRun, maxMistakes }: GameSetupInterface) =>
        void runGameCreation(() => {
            const { sudoku, rating, isRatingCeiling } = forgePuzzle(difficulty);
            const sudokuString = sudoku.toString();

            setEngine(new FieldEngine({ sudokuString, difficulty }));

            dispatch(gameStartAction({ difficulty, isChallengeRun, maxMistakes, sudokuString, rating, isRatingCeiling }));
            router.replace('/game');
        });

    useEffect(() => void i18n.activate(currentLanguage), [currentLanguage]);

    const value = { create, createFromState, engine, isCreatingGame, snapshot };

    return <GameContext value={value}>{children}</GameContext>;
};
