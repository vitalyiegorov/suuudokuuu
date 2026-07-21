import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeRaceRunner } from '../challenge-race-runner/challenge-race-runner';
import { ChallengeTechniqueTick } from '../challenge-technique-tick/challenge-technique-tick';

import { ChallengeProgressBarStyles as styles } from './challenge-progress-bar.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';
import type { StyleProp, ViewStyle } from 'react-native';

const ANIMATION_DURATION_MS = 300;

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
    readonly opponentProgress: number;
    readonly playerProgress: number;
    readonly elapsedTime: number;
}

export const ChallengeProgressBar = ({ events, opponentProgress, playerProgress, elapsedTime }: Props) => {
    const { theme } = use(ThemeContext);

    const opponentProgressValue = useSharedValue(0);
    const playerProgressValue = useSharedValue(0);

    useEffect(() => {
        opponentProgressValue.value = withTiming(opponentProgress, { duration: ANIMATION_DURATION_MS });
    }, [opponentProgress, opponentProgressValue]);
    useEffect(() => {
        playerProgressValue.value = withTiming(playerProgress, { duration: ANIMATION_DURATION_MS });
    }, [playerProgress, playerProgressValue]);

    const opponentFillAnimatedStyle = useAnimatedStyle(() => ({
        width: `${interpolate(opponentProgressValue.value, [0, 1], [0, 100])}%`
    }));
    const playerMarkerAnimatedStyle = useAnimatedStyle(() => ({
        left: `${interpolate(playerProgressValue.value, [0, 1], [0, 100])}%`
    }));

    const trackStyle: StyleProp<ViewStyle> = [styles.track, { backgroundColor: theme.colors.black05 }];
    const opponentFillStyle = [styles.opponentFill, { backgroundColor: theme.colors.red }, opponentFillAnimatedStyle];
    const playerMarkerStyle = [styles.playerMarker, { backgroundColor: theme.colors.black }, playerMarkerAnimatedStyle];

    return (
        <View style={styles.raceArea}>
            <View style={trackStyle}>
                <Animated.View style={opponentFillStyle} />
                {events.map((event, index) => {
                    const isPassed = event.cumulativeTime < elapsedTime;

                    return (
                        <ChallengeTechniqueTick
                            isPassed={isPassed}
                            key={`technique-tick-${index}`}
                            positionPercent={event.positionPercent}
                            tier={event.tier}
                        />
                    );
                })}
                <ChallengeRaceRunner progress={opponentProgressValue} />
                <Animated.View style={playerMarkerStyle} />
            </View>
        </View>
    );
};
