import { useLingui } from '@lingui/react/macro';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

import { animationDurationConstant } from '../../../../@generic/constants/animation.constant';
import { useAppDispatch } from '../../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { useVibration } from '../../../../@generic/hooks/use-vibration.hook';
import { WinConfettiContext } from '../../../../confetti/context/win-confetti.context';
import { GameContext } from '../../../../game/context/game.context';
import { gameFinishAction, gameMistakeAction, gameSaveAction } from '../../../../game/store/game.actions';
import {
    gameChallengeTimeSelector,
    gameDifficultySelector,
    gameElapsedTimeSelector,
    gameHasRivalSelector,
    gameMaxMistakesSelector
} from '../../../../game/store/game.selectors';
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

    const dispatch = useAppDispatch();
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const hasRival = useAppSelector(gameHasRivalSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);
    const difficulty = useAppSelector(gameDifficultySelector);
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);

    useEffect(() => {
        const finishLostGame = () => {
            hapticImpact(ImpactFeedbackStyle.Heavy);

            dispatch(gameFinishAction({ difficulty, isWon: false, isChallenge: hasRival }));

            router.replace(gameScreenGetLostRoute(hasRival));
        };

        const unsubscribeMoveApplied = engine.on('moveApplied', move => {
            dispatch(gameSaveAction(gameGetSavePayload(engine, move)));

            hapticNotification(Haptics.NotificationFeedbackType.Success);

            fieldRef.current?.triggerCellSuccess(move.cell);
            fieldRef.current?.triggerAnimation(move.scoredCells);
        });

        const unsubscribeMistake = engine.on('mistake', mistake => {
            dispatch(gameMistakeAction(mistake.cell));

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
            dispatch(gameFinishAction({ difficulty, isWon: true, isChallenge: wonChallenge }));
            // HINT: We need to wait for the animation to finish, animation finish event would fix it?
            setTimeout(() => void router.replace(gameScreenGetWonRoute(hasRival, wonChallenge)), 10 * animationDurationConstant);
        });

        return () => {
            unsubscribeMoveApplied();
            unsubscribeMistake();
            unsubscribeCompleted();
        };
    }, [
        challengeTime,
        difficulty,
        dispatch,
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
