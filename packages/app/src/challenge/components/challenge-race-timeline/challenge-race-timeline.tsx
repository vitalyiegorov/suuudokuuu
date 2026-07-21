import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemeContext } from '../../../theme/context/theme.context';
import { getChallengeTimelineMarks } from '../../utils/get-challenge-timeline-marks.util';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';
import { ChallengeRaceRunner } from '../challenge-race-runner/challenge-race-runner';

import { ChallengeRaceTimelineStyles as styles } from './challenge-race-timeline.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';
import type { ViewStyle } from 'react-native';

const TICK_COUNT = 40;
const MARK_BASE_HEIGHT = 9;
const MARK_HEIGHT_STEP = 4;
const FILLER_HEIGHT = 6;
const UPCOMING_OPACITY = 0.3;
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
    const playerMarkerAnimatedStyle = useAnimatedStyle(() => ({ left: `${playerProgressValue.value * PERCENT}%` }));
    const playerMarkerStyle = [styles.playerMarker, { backgroundColor: theme.colors.blue }, playerMarkerAnimatedStyle];

    return (
        <View style={styles.track}>
            {marks.map((mark, index) => {
                const markPercent = index / (TICK_COUNT - 1);
                const isPassed = opponentProgress >= markPercent;
                const markColor = mark.tier === null ? theme.colors.white05 : getTechniqueTierColor(mark.tier, theme, 'inverted');
                const markHeight = mark.tier === null ? FILLER_HEIGHT : MARK_BASE_HEIGHT + mark.complexity * MARK_HEIGHT_STEP;
                const markStyle: ViewStyle = { backgroundColor: markColor, height: markHeight, opacity: isPassed ? 1 : UPCOMING_OPACITY };
                const tickStyle = [styles.tick, markStyle];

                return <View key={`race-tick-${index}`} style={tickStyle} />;
            })}
            <Animated.View style={playerMarkerStyle} />
            <ChallengeRaceRunner progress={opponentProgressValue} />
        </View>
    );
};
