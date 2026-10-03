import { useLingui } from '@lingui/react/macro';
import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../../@generic/constants/animation.constant';
import { useVibration } from '../../../../@generic/hooks/use-vibration.hook';
import { appRuntime } from '../../../../@generic/runtime/app.runtime';
import { WinConfettiContext } from '../../../../confetti/context/win-confetti.context';
import { GameContext } from '../../../../game/context/game.context';
import { useCurrentRun } from '../../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../../game/query/use-elapsed-time.query';
import { gameCreateDeferredTaskQueue } from '../../../../game/utils/game-create-deferred-task-queue.util';
import { gameGetClassifyMovePayload } from '../../../../game/utils/game-get-classify-move-payload.util';
import { gameGetSavePayload } from '../../../../game/utils/game-get-save-payload.util';
import { gameScreenGetLostRoute, gameScreenGetWonRoute } from '../utils/game-screen-get-result-route.util';
import { gameScreenMaybeStartWinConfetti } from '../utils/game-screen-maybe-start-win-confetti.util';

import type { FieldRef } from '../../../../game/components/field/field';
import type { RefObject } from 'react';

export const useGameEngineEvents = (fieldRef: RefObject<FieldRef | null>): void => {
    const router = useRouter();
    const { t } = useLingui();

    const { engine } = use(GameContext);
    const startWinConfetti = use(WinConfettiContext);

    const [hapticNotification, hapticImpact] = useVibration();
    const { challengeState, challengeTime, maxMistakes } = useCurrentRun();
    const elapsedTime = useElapsedTime();
    const hasRival = isNotEmptyString(challengeState);

    useEffect(() => {
        const deferredClassifications = gameCreateDeferredTaskQueue();

        const finishLostGame = () => {
            hapticImpact(ImpactFeedbackStyle.Heavy);

            void appRuntime.runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.finish(false, hasRival)));

            router.replace(gameScreenGetLostRoute(hasRival));
        };

        const unsubscribeMoveApplied = engine.on('moveApplied', move => {
            void appRuntime.runPromise(
                Effect.flatMap(CurrentRunService, currentRunService => currentRunService.save(gameGetSavePayload(engine, move)))
            );

            hapticNotification(Haptics.NotificationFeedbackType.Success);

            fieldRef.current?.triggerCellSuccess(move.cell);
            fieldRef.current?.triggerAnimation(move.scoredCells);

            const postMoveSudokuString = engine.Sudoku.toString();

            deferredClassifications.schedule(
                () =>
                    void appRuntime.runPromise(
                        Effect.flatMap(CurrentRunService, currentRunService =>
                            currentRunService.classifyMove(gameGetClassifyMovePayload(postMoveSudokuString, move.cell))
                        )
                    )
            );
        });

        const unsubscribeMistake = engine.on('mistake', mistake => {
            void appRuntime.runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.mistake(mistake.cell)));

            const mistakeCount = mistake.mistakes;

            if (mistakeCount >= maxMistakes) {
                AccessibilityInfo.announceForAccessibility(t`Wrong value. Too many mistakes, the run is over.`);
                finishLostGame();
            } else {
                AccessibilityInfo.announceForAccessibility(t`Wrong value. Mistake ${mistakeCount} of ${maxMistakes}.`);
                hapticNotification(Haptics.NotificationFeedbackType.Error);
            }
        });

        const unsubscribeCompleted = engine.on('completed', () => {
            AccessibilityInfo.announceForAccessibility(t`Puzzle solved.`);
            hapticImpact(ImpactFeedbackStyle.Heavy);

            const wonChallenge = hasRival && elapsedTime < challengeTime;

            gameScreenMaybeStartWinConfetti(hasRival, wonChallenge, startWinConfetti);
            deferredClassifications.flush();
            void appRuntime.runPromise(
                Effect.flatMap(CurrentRunService, currentRunService => currentRunService.finish(true, wonChallenge))
            );
            // HINT: We need to wait for the animation to finish, animation finish event would fix it?
            setTimeout(() => void router.replace(gameScreenGetWonRoute(hasRival, wonChallenge)), 10 * animationDurationConstant);
        });

        return () => {
            deferredClassifications.flush();
            unsubscribeMoveApplied();
            unsubscribeMistake();
            unsubscribeCompleted();
        };
    }, [
        challengeTime,
        elapsedTime,
        engine,
        fieldRef,
        hapticImpact,
        hapticNotification,
        hasRival,
        maxMistakes,
        router,
        startWinConfetti,
        t
    ]);
};
