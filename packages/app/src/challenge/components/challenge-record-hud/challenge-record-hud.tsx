import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameElapsedTimeSelector, gameTimelineEventsSelector } from '../../../game/store/game.selectors';
import { ChallengeRecordTape } from '../challenge-record-tape/challenge-record-tape';

import { ChallengeRecordHudSelectors } from './challenge-record-hud.selectors';
import { ChallengeRecordHudStyles as styles } from './challenge-record-hud.styles';

const PulseDurationMs = 900;
const PulseMinOpacity = 0.25;

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
    const techniqueStyles = [styles.technique, { color: theme.colors.label.hint }];

    return (
        <View style={styles.container} testID={ChallengeRecordHudSelectors.Root}>
            <View style={styles.header}>
                <Animated.View style={dotStyles} />

                <BlackText style={badgeStyles}>{t`Recording`}</BlackText>

                <BlackText numberOfLines={1} style={techniqueStyles}>
                    {t`Challenge run`}
                </BlackText>
            </View>

            <ChallengeRecordTape elapsedTime={elapsedTime} timelineEvents={timelineEvents} />
        </View>
    );
};
