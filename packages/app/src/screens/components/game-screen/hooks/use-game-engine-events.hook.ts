import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { CurrentRunService, StoreReviewService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as FiberSet from 'effect/FiberSet';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { use, useEffect, useRef } from 'react';
import { AccessibilityInfo } from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../../@generic/constants/animation.constant';
import { useVibration } from '../../../../@generic/hooks/use-vibration.hook';
import { appRuntime } from '../../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../../@generic/utils/log-error-cause.util';
import { ChallengeLossReason } from '../../../../challenge/enums/challenge-loss-reason.enum';
import { classifyTimelineMove } from '../../../../challenge/utils/classify-timeline-move.util';
import { WinConfettiContext } from '../../../../confetti/context/win-confetti.context';
import { GameContext } from '../../../../game/context/game.context';
import { useCurrentRun } from '../../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../../game/query/use-elapsed-time.query';
import { finishGameOnce } from '../../../../game/utils/finish-game-once.util';
import { gameGetFieldStatePayload } from '../../../../game/utils/game-get-field-state-payload.util';

import type { FieldRef } from '../../../../game/components/field/field';
import type { FieldEngine } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';
import type * as Fiber from 'effect/Fiber';
import type { RefObject } from 'react';

interface GameEventStateInterface {
    readonly challengeTime: number;
    readonly elapsedTime: number;
    readonly hasRival: boolean;
    readonly haptics: ReturnType<typeof useVibration>;
    readonly maxMistakes: number;
    readonly router: ReturnType<typeof useRouter>;
    readonly startWinConfetti: () => void;
    readonly t: ReturnType<typeof useLingui>['t'];
}

const requestStoreReview = Effect.gen(function* () {
    if (Constants.expoConfig?.extra?.['isE2E'] === true || !(yield* Effect.promise(() => StoreReview.isAvailableAsync()))) {
        return;
    }
    const storeReviewService = yield* StoreReviewService;
    if (yield* storeReviewService.claimAfterWin(Constants.expoConfig?.version ?? '')) {
        yield* Effect.promise(() => StoreReview.requestReview());
    }
}).pipe(Effect.tapCause(logErrorCause), Effect.ignoreCause);

const classifyMove = Effect.fn('useGameEngineEvents.classifyMove')(function* (sudokuString: string, cell: CellInterface) {
    const cellIndex = cell.y * defaultSudokuConfig.fieldSize + cell.x;
    const preMoveString = `${sudokuString.slice(0, cellIndex)}.${sudokuString.slice(cellIndex + 1)}`;
    const currentRunService = yield* CurrentRunService;
    yield* currentRunService.classifyMove({
        cell,
        technique: classifyTimelineMove(Sudoku.fromString(preMoveString, { ...defaultSudokuConfig }), cell)
    });
});

const subscribeMoves = (
    engine: FieldEngine,
    fieldRef: RefObject<FieldRef | null>,
    eventStateRef: RefObject<GameEventStateInterface>,
    pendingClassifications: FiberSet.FiberSet<unknown, never>
) =>
    engine.on('moveApplied', move => {
        appRuntime.runFork(
            Effect.flatMap(CurrentRunService, currentRunService =>
                currentRunService.save({
                    ...gameGetFieldStatePayload(engine),
                    correctCell: move.cell,
                    scoredCells: move.scoredCells,
                    ...(isDefined(move.hintTechnique) && { hintTechnique: move.hintTechnique })
                })
            ).pipe(Effect.tapCause(logErrorCause))
        );
        eventStateRef.current.haptics[0](Haptics.NotificationFeedbackType.Success);
        fieldRef.current?.triggerCellSuccess(move.cell);
        fieldRef.current?.triggerAnimation(move.scoredCells);
        if (isDefined(move.hintTechnique)) {
            return;
        }
        const classification = classifyMove(engine.Sudoku.toString(), move.cell);
        FiberSet.addUnsafe(
            pendingClassifications,
            appRuntime.runFork(
                Effect.gen(function* () {
                    yield* Effect.sleep(0);
                    yield* classification;
                }).pipe(Effect.tapCause(logErrorCause))
            )
        );
    });

const subscribeResults = (
    engine: FieldEngine,
    eventStateRef: RefObject<GameEventStateInterface>,
    pendingClassifications: FiberSet.FiberSet<unknown, never>
) => {
    const resultFibers = new Set<Fiber.Fiber<void>>();
    const unsubscribeMistake = engine.on('mistake', mistake => {
        const { hasRival, haptics, maxMistakes, router, t } = eventStateRef.current;
        appRuntime.runFork(
            Effect.flatMap(CurrentRunService, currentRunService => currentRunService.mistake(mistake.cell)).pipe(
                Effect.tapCause(logErrorCause)
            )
        );
        const mistakeCount = mistake.mistakes;
        if (mistakeCount < maxMistakes) {
            AccessibilityInfo.announceForAccessibility(t(msg`Wrong value. Mistake ${mistakeCount} of ${maxMistakes}.`));
            haptics[0](Haptics.NotificationFeedbackType.Error);

            return;
        }
        AccessibilityInfo.announceForAccessibility(t(msg`Wrong value. Too many mistakes, the run is over.`));
        haptics[1](ImpactFeedbackStyle.Heavy);
        resultFibers.add(
            appRuntime.runFork(
                Effect.gen(function* () {
                    const didFinish = yield* finishGameOnce(
                        engine,
                        Effect.gen(function* () {
                            yield* FiberSet.awaitEmpty(pendingClassifications);
                            const currentRunService = yield* CurrentRunService;
                            yield* currentRunService.finish(false, hasRival);
                        })
                    );
                    if (!didFinish) {
                        return;
                    }
                    router.replace(hasRival ? { pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Mistakes } } : '/loser');
                }).pipe(Effect.tapCause(logErrorCause))
            )
        );
    });
    const unsubscribeCompleted = engine.on('completed', () => {
        const { challengeTime, elapsedTime, hasRival, haptics, router, startWinConfetti, t } = eventStateRef.current;
        AccessibilityInfo.announceForAccessibility(t(msg`Puzzle solved.`));
        haptics[1](ImpactFeedbackStyle.Heavy);
        const wonChallenge = hasRival && elapsedTime < challengeTime;
        const isCelebrationWin = !hasRival || wonChallenge;
        if (isCelebrationWin) {
            startWinConfetti();
        }
        resultFibers.add(
            appRuntime.runFork(
                Effect.gen(function* () {
                    const didFinish = yield* finishGameOnce(
                        engine,
                        Effect.gen(function* () {
                            yield* FiberSet.awaitEmpty(pendingClassifications);
                            const currentRunService = yield* CurrentRunService;
                            yield* currentRunService.finish(true, wonChallenge);
                        })
                    );
                    if (!didFinish) {
                        return;
                    }
                    yield* Effect.sleep(10 * animationDurationConstant);
                    if (!hasRival) {
                        router.replace('/winner');
                    } else if (wonChallenge) {
                        router.replace('/challenge-won');
                    } else {
                        router.replace({ pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Time } });
                    }
                    if (isCelebrationWin) {
                        appRuntime.runFork(requestStoreReview);
                    }
                }).pipe(Effect.tapCause(logErrorCause))
            )
        );
    });

    return () => {
        resultFibers.forEach(fiber => void fiber.interruptUnsafe());
        unsubscribeMistake();
        unsubscribeCompleted();
    };
};

const subscribeEngine = Effect.fn('useGameEngineEvents.subscribeEngine')(function* (
    engine: FieldEngine,
    fieldRef: RefObject<FieldRef | null>,
    eventStateRef: RefObject<GameEventStateInterface>
) {
    const pendingClassifications = yield* FiberSet.make<unknown, never>();
    const unsubscribeMoves = subscribeMoves(engine, fieldRef, eventStateRef, pendingClassifications);
    const unsubscribeResults = subscribeResults(engine, eventStateRef, pendingClassifications);
    yield* Effect.addFinalizer(() =>
        Effect.sync(() => {
            unsubscribeMoves();
            unsubscribeResults();
        }).pipe(Effect.andThen(FiberSet.awaitEmpty(pendingClassifications)))
    );

    return yield* Effect.never;
}, Effect.scoped);

export const useGameEngineEvents = (fieldRef: RefObject<FieldRef | null>): void => {
    const router = useRouter();
    const { t } = useLingui();
    const { engine } = use(GameContext);
    const startWinConfetti = use(WinConfettiContext);
    const haptics = useVibration();
    const { challengeState, challengeTime, maxMistakes } = useCurrentRun();
    const elapsedTime = useElapsedTime();
    const hasRival = isNotEmptyString(challengeState);
    const eventStateRef = useRef<GameEventStateInterface>({
        challengeTime,
        elapsedTime,
        hasRival,
        haptics,
        maxMistakes,
        router,
        startWinConfetti,
        t
    });
    useEffect(() => {
        eventStateRef.current = { challengeTime, elapsedTime, hasRival, haptics, maxMistakes, router, startWinConfetti, t };
    }, [challengeTime, elapsedTime, hasRival, haptics, maxMistakes, router, startWinConfetti, t]);
    useEffect(() => {
        const subscriptionFiber = appRuntime.runFork(subscribeEngine(engine, fieldRef, eventStateRef));

        return () => void subscriptionFiber.interruptUnsafe();
    }, [engine, fieldRef]);
};
