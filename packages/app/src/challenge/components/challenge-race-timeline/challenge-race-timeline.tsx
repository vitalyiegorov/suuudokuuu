import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemeContext } from '../../../theme/context/theme.context';
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
const MOVE_PASSED_OPACITY = 0.7;
const MOVE_UPCOMING_OPACITY = 0.26;
const FILLER_PASSED_OPACITY = 0.3;
const FILLER_UPCOMING_OPACITY = 0.14;
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
    const fillStyle = [styles.fill, { backgroundColor: theme.colors.label.inverted }, fillAnimatedStyle];
    const playerMarkerAnimatedStyle = useAnimatedStyle(() => ({ left: `${playerProgressValue.value * PERCENT}%` }));
    const playerMarkerStyle = [styles.playerMarker, { backgroundColor: theme.colors.label.inverted }, playerMarkerAnimatedStyle];

    return (
        <View style={trackStyle}>
            {marks.map((mark, index) => {
                const markPercent = (index + TICK_CENTER_OFFSET) / TICK_COUNT;
                const isPassed = opponentProgress >= markPercent;
                const isMove = mark.tier !== null;
                const moveOpacity = isPassed ? MOVE_PASSED_OPACITY : MOVE_UPCOMING_OPACITY;
                const fillerOpacity = isPassed ? FILLER_PASSED_OPACITY : FILLER_UPCOMING_OPACITY;
                const markHeight = isMove ? MARK_BASE_HEIGHT + mark.complexity * MARK_HEIGHT_STEP : FILLER_HEIGHT;
                const markStyle: ViewStyle = {
                    backgroundColor: theme.colors.label.inverted,
                    height: markHeight,
                    opacity: isMove ? moveOpacity : fillerOpacity
                };
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
