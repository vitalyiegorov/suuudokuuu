import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameElapsedTimeSelector, gameTimelineEventsSelector } from '../../../game/store/game.selectors';
import { getChallengeTapeMarks } from '../../utils/get-challenge-tape-marks.util';
import { getTapeTechniqueEvents } from '../../utils/get-tape-technique-events.util';
import { ChallengeRaceBadge } from '../challenge-race-badge/challenge-race-badge';
import { ChallengeTimelineTrack } from '../challenge-timeline-track/challenge-timeline-track';

import { ChallengeRecordHudSelectors } from './challenge-record-hud.selectors';
import { ChallengeRecordHudStyles as styles } from './challenge-record-hud.styles';

const TickCount = 44;
const PulseDurationMs = 900;
const PulseMinOpacity = 0.25;
const FullProgress = 1;
const BadgeLookaheadSeconds = 1;

export const ChallengeRecordHud = () => {
    const { t } = useLingui();
    const { theme } = useUnistyles();
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const timelineEvents = useAppSelector(gameTimelineEventsSelector);

    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(withTiming(PulseMinOpacity, { duration: PulseDurationMs, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, [pulse]);

    const dotAnimatedStyles = useAnimatedStyle(() => ({ opacity: pulse.value }));
    const dotStyles = [resolveUnistyleForAnimated(styles.recordDot), { backgroundColor: theme.colors.red }, dotAnimatedStyles];
    const badgeStyles = [styles.badge, { color: theme.colors.label.main }];
    const marks = getChallengeTapeMarks(timelineEvents, elapsedTime, TickCount);
    const techniqueEvents = getTapeTechniqueEvents(timelineEvents, elapsedTime);
    const badgeElapsedTime = elapsedTime + BadgeLookaheadSeconds;

    return (
        <View style={styles.container} testID={ChallengeRecordHudSelectors.Root}>
            <View style={styles.header}>
                <Animated.View style={dotStyles} />

                <BlackText style={badgeStyles}>{t`Recording`}</BlackText>

                <View style={styles.badgeSlot}>
                    <ChallengeRaceBadge elapsedTime={badgeElapsedTime} events={techniqueEvents} />
                </View>
            </View>

            <ChallengeTimelineTrack marks={marks} progress={FullProgress} />
        </View>
    );
};
