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
    gameChallengeTimelineEventsSelector,
    gameElapsedTimeSelector,
    gameSolutionsStepsSelector
} from '../../../game/store/game.selectors';
import { ChallengeLossReason } from '../../enums/challenge-loss-reason.enum';
import { useChallengeTechniqueEvents } from '../../hooks/use-challenge-technique-events.hook';
import { getChallengeAwayRanges } from '../../utils/get-challenge-away-ranges.util';
import { getChallengeProgress } from '../../utils/get-challenge-progress.util';
import { ChallengeRaceBadge } from '../challenge-race-badge/challenge-race-badge';
import { ChallengeRaceStatus } from '../challenge-race-status/challenge-race-status';
import { ChallengeRaceTimeline } from '../challenge-race-timeline/challenge-race-timeline';

import { ChallengeRaceHudSelectors } from './challenge-race-hud.selectors';
import { ChallengeRaceHudStyles as styles } from './challenge-race-hud.styles';

export const ChallengeRaceHud = () => {
    const { sudoku } = use(GameContext);

    const dispatch = useAppDispatch();
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const challengeSteps = useAppSelector(gameChallengeStepsSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);
    const playerSteps = useAppSelector(gameSolutionsStepsSelector);
    const challengeTimelineEvents = useAppSelector(gameChallengeTimelineEventsSelector);

    const events = useChallengeTechniqueEvents();

    const awayRanges = getChallengeAwayRanges(challengeTimelineEvents, challengeTime);
    const [, opponentProgress] = getChallengeProgress(challengeSteps, challengeTime, elapsedTime);
    const playerProgress = challengeSteps.length === 0 ? 0 : playerSteps.length / challengeSteps.length;

    useEffect(() => {
        if (opponentProgress >= 1) {
            dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: false, isChallenge: true }));
            router.replace({ pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Time } });
        }
    }, [opponentProgress, dispatch, sudoku.Difficulty]);

    return (
        <View style={styles.container} testID={ChallengeRaceHudSelectors.Root}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <ChallengeRaceStatus opponentProgress={opponentProgress} playerProgress={playerProgress} />
                    <ChallengeRaceBadge elapsedTime={elapsedTime} events={events} />
                </View>
                <ChallengeRaceTimeline
                    awayRanges={awayRanges}
                    events={events}
                    opponentProgress={opponentProgress}
                    playerProgress={playerProgress}
                    totalTime={challengeTime}
                />
            </View>
        </View>
    );
};
