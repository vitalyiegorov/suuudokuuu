import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemeContext } from '../../../theme/context/theme.context';
import {
    ChallengeRaceAccent,
    ChallengeRaceAccentUpcoming,
    ChallengeRaceFillerDim,
    ChallengeRaceFillerLit,
    ChallengeRacePlayerMarker
} from '../../constants/challenge-race-palette.constant';
import { getChallengeTimelineMarks } from '../../utils/get-challenge-timeline-marks.util';
import { ChallengeRaceRunner } from '../challenge-race-runner/challenge-race-runner';

import { ChallengeRaceTimelineStyles as styles } from './challenge-race-timeline.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';
import type { ViewStyle } from 'react-native';

const TICK_COUNT = 44;
const TICK_CENTER_OFFSET = 0.5;
const MARK_BASE_HEIGHT = 9;
const MARK_HEIGHT_STEP = 3;
const FILLER_HEIGHT = 6;
const PERCENT = 100;
const ANIMATION_DURATION_MS = 300;

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
    readonly opponentProgress: number;
    readonly playerProgress: number;
}

export const ChallengeRaceTimeline = ({ events, opponentProgress, playerProgress }: Props) => {
    const { theme } = use(ThemeContext);

    const opponentProgressValue = useSharedValue(opponentProgress);
    const playerProgressValue = useSharedValue(playerProgress);

    useEffect(() => {
        opponentProgressValue.value = withTiming(opponentProgress, { duration: ANIMATION_DURATION_MS });
    }, [opponentProgress, opponentProgressValue]);
    useEffect(() => {
        playerProgressValue.value = withTiming(playerProgress, { duration: ANIMATION_DURATION_MS });
    }, [playerProgress, playerProgressValue]);

    const marks = getChallengeTimelineMarks(events, TICK_COUNT);
    const trackStyle = [styles.track, { backgroundColor: theme.colors.white05 }];
    const fillAnimatedStyle = useAnimatedStyle(() => ({ width: `${opponentProgressValue.value * PERCENT}%` }));
    const fillStyle = [styles.fill, { backgroundColor: ChallengeRaceAccent }, fillAnimatedStyle];
    const playerMarkerAnimatedStyle = useAnimatedStyle(() => ({ left: `${playerProgressValue.value * PERCENT}%` }));
    const playerMarkerStyle = [styles.playerMarker, { backgroundColor: ChallengeRacePlayerMarker }, playerMarkerAnimatedStyle];

    return (
        <View style={trackStyle}>
            {marks.map((mark, index) => {
                const markPercent = (index + TICK_CENTER_OFFSET) / TICK_COUNT;
                const isPassed = opponentProgress >= markPercent;
                const isMove = mark.tier !== null;
                const moveColor = isPassed ? ChallengeRaceAccent : ChallengeRaceAccentUpcoming;
                const fillerColor = isPassed ? ChallengeRaceFillerLit : ChallengeRaceFillerDim;
                const markHeight = isMove ? MARK_BASE_HEIGHT + mark.complexity * MARK_HEIGHT_STEP : FILLER_HEIGHT;
                const markStyle: ViewStyle = { backgroundColor: isMove ? moveColor : fillerColor, height: markHeight };
                const tickStyle = [styles.tick, markStyle];

                return <View key={`race-tick-${index}`} style={tickStyle} />;
            })}

            <View pointerEvents="none" style={styles.overlay}>
                <Animated.View style={fillStyle} />
                <Animated.View style={playerMarkerStyle} />
                <ChallengeRaceRunner progress={opponentProgressValue} />
            </View>
        </View>
    );
};
