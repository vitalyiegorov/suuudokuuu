import { FieldEngine } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { forgeDailyPuzzle, forgePuzzle, getDailyDateString, getDailyDayNumber, getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import { useEffect } from 'react';

import { i18nActivateLanguage } from '../../../@generic/utils/i18n-catalogs';
import { useSettings } from '../../../settings/query/use-settings.query';
import { GameContext } from '../../context/game.context';
import { useGameCreationRunner } from '../../hooks/use-game-creation-runner.hook';
import { useGameEngineState } from '../../hooks/use-game-engine-state.hook';
import { gameCreateEngine } from '../../utils/game-create-engine.util';
import { runCurrentRunCommand } from '../../utils/run-current-run-command.util';

import type { GameSetupInterface } from '../../interface/game-setup.interface';
import type { CurrentRunType } from '@suuudokuuu/progress';
import type { ForgedPuzzleInterface } from '@suuudokuuu/puzzle-forge';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
    const { isCreatingGame, router, runGameCreation, showAlert } = useGameCreationRunner();

    const currentLanguage = useSettings().language;

    const [engine, setEngine] = useGameEngineState(showAlert);
    const snapshot = useFieldSnapshot(engine);

    const enterRun = (command: Parameters<typeof runCurrentRunCommand>[0]) =>
        void runCurrentRunCommand(command).then(() => void router.dismissTo('/game'));

    const createFromState = (newState: CurrentRunType) =>
        void runGameCreation(() => {
            setEngine(gameCreateEngine(newState));
            enterRun(currentRunService => currentRunService.load(newState));
        });

    const startForgedGame = (
        { sudoku, rating, isRatingCeiling }: ForgedPuzzleInterface,
        setup: Pick<CurrentRunType, 'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'maxMistakes'>
    ) => {
        const sudokuString = sudoku.toString();

        setEngine(new FieldEngine({ sudokuString, difficulty: setup.difficulty }));

        enterRun(currentRunService => currentRunService.start({ ...setup, sudokuString, rating, isRatingCeiling }));
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

    useEffect(() => void i18nActivateLanguage(currentLanguage), [currentLanguage]);

    const value = { create, createDaily, createFromState, engine, isCreatingGame, snapshot };

    return <GameContext value={value}>{children}</GameContext>;
};
