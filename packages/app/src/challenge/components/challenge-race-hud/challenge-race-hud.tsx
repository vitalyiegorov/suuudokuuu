import { router } from 'expo-router';
import { use, useEffect } from 'react';
import { View } from 'react-native';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { GameContext } from '../../../game/context/game.context';
import { gameFinishAction } from '../../../game/store/game.actions';
import {
    gameChallengeStepsSelector,
    gameChallengeTimeSelector,
    gameElapsedTimeSelector,
    gameSolutionsStepsSelector
} from '../../../game/store/game.selectors';
import { ChallengeLossReason } from '../../enums/challenge-loss-reason.enum';
import { useChallengeTechniqueEvents } from '../../hooks/use-challenge-technique-events.hook';
import { getChallengeProgress } from '../../utils/get-challenge-progress.util';
import { ChallengeProgressBar } from '../challenge-progress-bar/challenge-progress-bar';
import { ChallengeTechniqueCallout } from '../challenge-technique-callout/challenge-technique-callout';

import { ChallengeRaceHudStyles as styles } from './challenge-race-hud.styles';

export const ChallengeRaceHud = () => {
    const { sudoku } = use(GameContext);

    const dispatch = useAppDispatch();
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const challengeSteps = useAppSelector(gameChallengeStepsSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);
    const playerSteps = useAppSelector(gameSolutionsStepsSelector);

    const events = useChallengeTechniqueEvents();

    const [, opponentProgress] = getChallengeProgress(challengeSteps, challengeTime, elapsedTime);
    const playerProgress = challengeSteps.length === 0 ? 0 : playerSteps.length / challengeSteps.length;

    useEffect(() => {
        if (opponentProgress >= 1) {
            dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: false, isChallenge: true }));
            router.replace({ pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Time } });
        }
    }, [opponentProgress, dispatch, sudoku.Difficulty]);

    return (
        <View style={styles.container}>
            <ChallengeProgressBar
                elapsedTime={elapsedTime}
                events={events}
                opponentProgress={opponentProgress}
                playerProgress={playerProgress}
            />
            <View style={styles.calloutRow}>
                <ChallengeTechniqueCallout elapsedTime={elapsedTime} events={events} />
            </View>
        </View>
    );
};
