import { FieldEngine } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { CurrentRunService } from '@suuudokuuu/progress';
import { getDailyDateString, getDailyDayNumber, getDailyDifficulty, getDailyPuzzleSeed } from '@suuudokuuu/puzzle-forge';
import * as Clock from 'effect/Clock';
import * as Effect from 'effect/Effect';
import * as AtomRegistry from 'effect/reactivity/AtomRegistry';

import { appAtomRegistry } from '../../../@generic/constants/app-atom-registry.constant';
import { GameContext } from '../../context/game.context';
import { useGameCreationRunner } from '../../hooks/use-game-creation-runner.hook';
import { useGameEngineState } from '../../hooks/use-game-engine-state.hook';
import { currentRunAtom } from '../../query/use-current-run.query';
import { PuzzleGenerationService } from '../../service/puzzle-generation.service';
import { gameCreateEngine } from '../../utils/game-create-engine.util';

import type { GameSetupInterface } from '../../interface/game-setup.interface';
import type { CurrentRunType } from '@suuudokuuu/progress';
import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const GameProvider = ({ children }: Props) => {
    const { isCreatingGame, router, runGameCreation, showAlert } = useGameCreationRunner();
    const [engine, setEngine] = useGameEngineState(showAlert);
    const snapshot = useFieldSnapshot(engine);

    const enterRun = <A, E>(
        createEngine: () => FieldEngine,
        command: (currentRunService: CurrentRunService['Service']) => Effect.Effect<A, E>
    ) =>
        Effect.try(createEngine).pipe(
            Effect.tap(Effect.flatMap(CurrentRunService, command)),
            Effect.flatMap(nextEngine => Effect.sync(() => void setEngine(nextEngine))),
            Effect.andThen(AtomRegistry.getResult(appAtomRegistry, currentRunAtom, { suspendOnWaiting: true })),
            Effect.andThen(Effect.sync(() => void router.dismissTo('/game')))
        );

    const createFromState = (newState: CurrentRunType) =>
        void runGameCreation(
            enterRun(
                () => gameCreateEngine(newState),
                currentRunService => currentRunService.load(newState)
            )
        );

    const startForgedGame = (
        { sudokuString, solutionString, rating, isRatingCeiling }: SerializedPuzzleInterface,
        setup: Pick<CurrentRunType, 'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'maxMistakes'>
    ) =>
        enterRun(
            () => new FieldEngine({ sudokuString, solutionString, difficulty: setup.difficulty }),
            currentRunService => currentRunService.start({ ...setup, sudokuString, rating, isRatingCeiling })
        );

    const create = ({ difficulty, isChallengeRun, maxMistakes }: GameSetupInterface) =>
        void runGameCreation(
            Effect.flatMap(PuzzleGenerationService, service => service.generate(difficulty)).pipe(
                Effect.flatMap(puzzle => startForgedGame(puzzle, { difficulty, isChallengeRun, maxMistakes, dailyDayNumber: 0 }))
            )
        );

    const createDaily = (maxMistakes: number) =>
        void runGameCreation(
            Clock.currentTimeMillis.pipe(
                Effect.map(getDailyDateString),
                Effect.flatMap(dateString =>
                    Effect.flatMap(PuzzleGenerationService, service =>
                        service.generate(getDailyDifficulty(dateString), getDailyPuzzleSeed(dateString))
                    ).pipe(
                        Effect.flatMap(puzzle =>
                            startForgedGame(puzzle, {
                                difficulty: getDailyDifficulty(dateString),
                                isChallengeRun: false,
                                maxMistakes,
                                dailyDayNumber: getDailyDayNumber(dateString)
                            })
                        )
                    )
                )
            )
        );

    const value = { create, createDaily, createFromState, engine, isCreatingGame, snapshot };

    return <GameContext value={value}>{children}</GameContext>;
};
