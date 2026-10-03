import { useLingui } from '@lingui/react/macro';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../../@generic/constants/animation.constant';
import { useVibration } from '../../../../@generic/hooks/use-vibration.hook';
import { classifyTimelineMove } from '../../../../challenge/utils/classify-timeline-move.util';
import { WinConfettiContext } from '../../../../confetti/context/win-confetti.context';
import { GameContext } from '../../../../game/context/game.context';
import { useCurrentRun } from '../../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../../game/query/use-elapsed-time.query';
import { gameCreateDeferredTaskQueue } from '../../../../game/utils/game-create-deferred-task-queue.util';
import { gameGetFieldStatePayload } from '../../../../game/utils/game-get-field-state-payload.util';
import { gameGetPreMoveSudoku } from '../../../../game/utils/game-get-pre-move-sudoku.util';
import { runCurrentRunCommand } from '../../../../game/utils/run-current-run-command.util';
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

            void runCurrentRunCommand(currentRunService => currentRunService.finish(false, hasRival));

            router.replace(gameScreenGetLostRoute(hasRival));
        };

        const unsubscribeMoveApplied = engine.on('moveApplied', move => {
            void runCurrentRunCommand(currentRunService =>
                currentRunService.save({ ...gameGetFieldStatePayload(engine), correctCell: move.cell, scoredCells: move.scoredCells })
            );

            hapticNotification(Haptics.NotificationFeedbackType.Success);

            fieldRef.current?.triggerCellSuccess(move.cell);
            fieldRef.current?.triggerAnimation(move.scoredCells);

            const postMoveSudokuString = engine.Sudoku.toString();

            deferredClassifications.schedule(
                () =>
                    void runCurrentRunCommand(currentRunService =>
                        currentRunService.classifyMove({
                            cell: move.cell,
                            technique: classifyTimelineMove(gameGetPreMoveSudoku(postMoveSudokuString, move.cell), move.cell)
                        })
                    )
            );
        });

        const unsubscribeMistake = engine.on('mistake', mistake => {
            void runCurrentRunCommand(currentRunService => currentRunService.mistake(mistake.cell));

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
            void runCurrentRunCommand(currentRunService => currentRunService.finish(true, wonChallenge));
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
