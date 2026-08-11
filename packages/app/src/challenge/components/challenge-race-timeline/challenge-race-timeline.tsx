import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getChallengeTimelineMarks } from '../../utils/get-challenge-timeline-marks.util';
import { ChallengeAwayBands } from '../challenge-away-bands/challenge-away-bands';
import { ChallengeRaceRunner } from '../challenge-race-runner/challenge-race-runner';
import { ChallengeTimelineTrack } from '../challenge-timeline-track/challenge-timeline-track';

import { ChallengeRaceTimelineStyles as styles } from './challenge-race-timeline.styles';

import type { ChallengeAwayRangeInterface } from '../../interfaces/challenge-away-range.interface';
import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

const TICK_COUNT = 44;
const PERCENT = 100;
const ANIMATION_DURATION_MS = 300;
const INSTANT_DURATION_MS = 0;

interface Props {
    readonly awayRanges: ChallengeAwayRangeInterface[];
    readonly events: ChallengeTechniqueEventInterface[];
    readonly opponentProgress: number;
    readonly playerProgress: number;
    readonly totalTime: number;
}

export const ChallengeRaceTimeline = ({ awayRanges, events, opponentProgress, playerProgress, totalTime }: Props) => {
    const { theme } = use(ThemeContext);

    const isMotionReduced = useReduceMotion();
    const progressDurationMs = isMotionReduced ? INSTANT_DURATION_MS : ANIMATION_DURATION_MS;

    const opponentProgressValue = useSharedValue(opponentProgress);
    const playerProgressValue = useSharedValue(playerProgress);

    useEffect(() => {
        opponentProgressValue.value = withTiming(opponentProgress, { duration: progressDurationMs });
    }, [opponentProgress, progressDurationMs, opponentProgressValue]);
    useEffect(() => {
        playerProgressValue.value = withTiming(playerProgress, { duration: progressDurationMs });
    }, [playerProgress, progressDurationMs, playerProgressValue]);

    const marks = getChallengeTimelineMarks(events, TICK_COUNT, totalTime).map(mark => ({ ...mark, isAway: false }));
    const isRivalAhead = opponentProgress > playerProgress;
    const gapColor = isRivalAhead ? theme.colors.danger : theme.colors.text.primary;
    const fillAnimatedStyle = useAnimatedStyle(() => ({
        width: `${Math.min(opponentProgressValue.value, playerProgressValue.value) * PERCENT}%`
    }));
    const fillStyle = [resolveUnistyleForAnimated(styles.fill), { backgroundColor: theme.colors.text.primary }, fillAnimatedStyle];
    const gapAnimatedStyle = useAnimatedStyle(() => ({
        left: `${Math.min(opponentProgressValue.value, playerProgressValue.value) * PERCENT}%`,
        width: `${Math.abs(opponentProgressValue.value - playerProgressValue.value) * PERCENT}%`
    }));
    const gapStyle = [resolveUnistyleForAnimated(styles.gap), { backgroundColor: gapColor }, gapAnimatedStyle];
    const playerMarkerAnimatedStyle = useAnimatedStyle(() => ({ left: `${playerProgressValue.value * PERCENT}%` }));
    const playerDotStyle = [
        styles.playerDot,
        { backgroundColor: theme.colors.text.primary, borderColor: theme.colors.surface.raised },
        playerMarkerAnimatedStyle
    ];

    return (
        <ChallengeTimelineTrack marks={marks} progress={opponentProgress}>
            <ChallengeAwayBands ranges={awayRanges} variant="default" />

            <View pointerEvents="none" style={styles.baselineLayer}>
                <Animated.View style={fillStyle} />
                <Animated.View style={gapStyle} />
            </View>

            <View pointerEvents="none" style={styles.overlay}>
                <Animated.View style={playerDotStyle} />
                <ChallengeRaceRunner progress={opponentProgressValue} />
            </View>
        </ChallengeTimelineTrack>
    );
};
