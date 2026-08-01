import { useEffect } from 'react';
import {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import {
    HomeScreenStartButtonEmberEntranceDurationMs,
    HomeScreenStartButtonEmberEntranceEasingFirstX,
    HomeScreenStartButtonEmberEntranceEasingFirstY,
    HomeScreenStartButtonEmberEntranceEasingSecondX,
    HomeScreenStartButtonEmberEntranceEasingSecondY,
    HomeScreenStartButtonEmberEntranceScale,
    HomeScreenStartButtonEmberGlowBreathDurationMs,
    HomeScreenStartButtonEmberGlowPulseOpacity,
    HomeScreenStartButtonEmberGlowRestOpacity,
    HomeScreenStartButtonEmberSheenIntervalMs,
    HomeScreenStartButtonEmberSheenStartRatio,
    HomeScreenStartButtonEmberSheenSweepDurationMs,
    HomeScreenStartButtonEmberSheenTravelRatio
} from './constant/home-screen-start-button-ember.constant';

export const useHomeScreenStartButtonEmberAnimation = (reduceMotion: boolean, surfaceWidth: number) => {
    const entrance = useSharedValue(0);
    const glowBreath = useSharedValue(0);
    const sheenProgress = useSharedValue(0);

    useEffect(() => {
        if (!reduceMotion) {
            entrance.value = withTiming(1, {
                duration: HomeScreenStartButtonEmberEntranceDurationMs,
                easing: Easing.bezier(
                    HomeScreenStartButtonEmberEntranceEasingFirstX,
                    HomeScreenStartButtonEmberEntranceEasingFirstY,
                    HomeScreenStartButtonEmberEntranceEasingSecondX,
                    HomeScreenStartButtonEmberEntranceEasingSecondY
                )
            });

            glowBreath.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: HomeScreenStartButtonEmberGlowBreathDurationMs, easing: Easing.inOut(Easing.quad) }),
                    withTiming(0, { duration: HomeScreenStartButtonEmberGlowBreathDurationMs, easing: Easing.inOut(Easing.quad) })
                ),
                -1,
                false
            );

            sheenProgress.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: HomeScreenStartButtonEmberSheenSweepDurationMs, easing: Easing.inOut(Easing.quad) }),
                    withDelay(HomeScreenStartButtonEmberSheenIntervalMs, withTiming(0, { duration: 0 }))
                ),
                -1,
                false
            );
        }

        return () => {
            cancelAnimation(entrance);
            cancelAnimation(glowBreath);
            cancelAnimation(sheenProgress);
        };
    }, [reduceMotion, entrance, glowBreath, sheenProgress]);

    const wrapperStyle = useAnimatedStyle(() => ({
        shadowOpacity: HomeScreenStartButtonEmberGlowRestOpacity + glowBreath.value * HomeScreenStartButtonEmberGlowPulseOpacity,
        transform: [{ scale: HomeScreenStartButtonEmberEntranceScale + entrance.value * (1 - HomeScreenStartButtonEmberEntranceScale) }]
    }));

    const sheenStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX:
                    (sheenProgress.value * HomeScreenStartButtonEmberSheenTravelRatio - HomeScreenStartButtonEmberSheenStartRatio) *
                    surfaceWidth
            }
        ]
    }));

    return { sheenStyle, wrapperStyle };
};
