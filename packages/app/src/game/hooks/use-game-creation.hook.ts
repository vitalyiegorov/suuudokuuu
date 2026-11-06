import { FieldEngine } from '@suuudokuuu/field-core';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { CurrentRunService } from '@suuudokuuu/progress';
import {
    getMatchingEntryCellIndexes,
    getDailyDateString,
    getDailyDayNumber,
    getDailyDifficulty,
    getDailyPuzzleSeed
} from '@suuudokuuu/puzzle-forge';
import * as Clock from 'effect/Clock';
import * as Effect from 'effect/Effect';
import * as AtomRegistry from 'effect/reactivity/AtomRegistry';

import { isDefined } from '@rnw-community/shared';

import { appAtomRegistry } from '../../@generic/constants/app-atom-registry.constant';
import { currentRunAtom } from '../query/use-current-run.query';
import { PuzzleGenerationService } from '../service/puzzle-generation.service';
import { gameCreateEngine } from '../utils/game-create-engine.util';
import { gameGetFieldStatePayload } from '../utils/game-get-field-state-payload.util';

import { useGameCreationRunner } from './use-game-creation-runner.hook';
import { useGameEngineState } from './use-game-engine-state.hook';

import type { GameContextValueInterface } from '../interface/game-context-value.interface';
import type { GameSetupInterface } from '../interface/game-setup.interface';
import type { CurrentRunType } from '@suuudokuuu/progress';
import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

const replayEntries = (
    currentRunService: CurrentRunService['Service'],
    nextEngine: FieldEngine,
    entryString: string,
    solutionString: string
) =>
    Effect.forEach(
        getMatchingEntryCellIndexes(entryString, solutionString),
        index =>
            Effect.sync(() =>
                nextEngine.placeValue(
                    nextEngine.Sudoku.Field[Math.floor(index / defaultSudokuConfig.fieldSize)][index % defaultSudokuConfig.fieldSize],
                    Number(entryString[index])
                )
            ).pipe(
                Effect.flatMap(move =>
                    isDefined(move)
                        ? currentRunService.save({
                              ...gameGetFieldStatePayload(nextEngine),
                              correctCell: move.cell,
                              scoredCells: move.scoredCells
                          })
                        : Effect.void
                )
            ),
        { discard: true }
    );

export const useGameCreation = () => {
    const { isCreatingGame, router, runGameCreation, showAlert } = useGameCreationRunner();
    const [engine, setEngine] = useGameEngineState(showAlert);

    const enterRun = <E>(
        createEngine: () => FieldEngine,
        command: (currentRunService: CurrentRunService['Service'], nextEngine: FieldEngine) => Effect.Effect<FieldEngine, E>
    ) =>
        Effect.try(createEngine).pipe(
            Effect.flatMap(nextEngine => Effect.flatMap(CurrentRunService, service => command(service, nextEngine))),
            Effect.tap(nextEngine => Effect.sync(() => void setEngine(nextEngine))),
            Effect.tap(() => AtomRegistry.getResult(appAtomRegistry, currentRunAtom, { suspendOnWaiting: true })),
            Effect.flatMap(nextEngine => Effect.sync(() => void router.dismissTo(nextEngine.getSnapshot().isWon ? '/winner' : '/game')))
        );

    const createFromState = (newState: CurrentRunType) =>
        void runGameCreation(
            enterRun(
                () => gameCreateEngine(newState),
                (currentRunService, nextEngine) => currentRunService.load(newState).pipe(Effect.as(nextEngine))
            )
        );

    const startRun = (
        setup: Pick<CurrentRunType, 'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'maxMistakes'>,
        { sudokuString, solutionString, rating, isRatingCeiling }: SerializedPuzzleInterface,
        entryString = ''
    ) =>
        enterRun(
            () => new FieldEngine({ sudokuString, solutionString, difficulty: setup.difficulty }),
            (currentRunService, nextEngine) =>
                currentRunService.start({ ...setup, sudokuString, rating, isRatingCeiling }).pipe(
                    Effect.andThen(replayEntries(currentRunService, nextEngine, entryString, solutionString)),
                    Effect.andThen(
                        Effect.suspend(() => (nextEngine.getSnapshot().isWon ? currentRunService.finish(true, false) : Effect.void))
                    ),
                    Effect.map(() => (entryString.length > 0 ? gameCreateEngine(nextEngine.serialize()) : nextEngine))
                )
        );

    const startForgedGame = (
        setup: Pick<CurrentRunType, 'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'maxMistakes'>,
        seed?: number
    ) =>
        Effect.flatMap(PuzzleGenerationService, service => service.generate(setup.difficulty, seed)).pipe(
            Effect.flatMap(puzzle => startRun(setup, puzzle))
        );

    const createFromImport: GameContextValueInterface['createFromImport'] = (
        sudokuString,
        { difficulty, ...puzzle },
        maxMistakes,
        entryString
    ) =>
        void runGameCreation(
            startRun({ difficulty, maxMistakes, isChallengeRun: false, dailyDayNumber: 0 }, { ...puzzle, sudokuString }, entryString)
        );

    const create = ({ difficulty, isChallengeRun, maxMistakes }: GameSetupInterface) =>
        void runGameCreation(startForgedGame({ difficulty, isChallengeRun, maxMistakes, dailyDayNumber: 0 }));

    const createDaily = (maxMistakes: number) =>
        void runGameCreation(
            Clock.currentTimeMillis.pipe(
                Effect.map(getDailyDateString),
                Effect.flatMap(dateString =>
                    startForgedGame(
                        {
                            difficulty: getDailyDifficulty(dateString),
                            isChallengeRun: false,
                            maxMistakes,
                            dailyDayNumber: getDailyDayNumber(dateString)
                        },
                        getDailyPuzzleSeed(dateString)
                    )
                )
            )
        );

    return { create, createDaily, createFromImport, createFromState, engine, isCreatingGame };
};
