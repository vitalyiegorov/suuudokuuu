import { AppButton, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use, useEffect } from 'react';
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import { ThemeContext } from '../../../../theme/context/theme.context';

import {
    HomeScreenStartButtonEmberGlowPulseOpacity,
    HomeScreenStartButtonEmberGlowRestOpacity,
    HomeScreenStartButtonEmberIdlePulseDurationMs,
    HomeScreenStartButtonEmberIdlePulseScale,
    HomeScreenStartButtonEmberShakeBurstDistance,
    HomeScreenStartButtonEmberShakeBurstDurationMs,
    HomeScreenStartButtonEmberShakeSegmentDurationMs
} from './constant/home-screen-start-button-ember.constant';
import { HomeScreenStartButtonEmberSelectors } from './home-screen-start-button-ember.selectors';
import { HomeScreenStartButtonEmberStyles as styles } from './home-screen-start-button-ember.styles';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly isLoading: boolean;
    readonly onPress: () => void;
    readonly style: StyleProp<ViewStyle>;
    readonly testID: string;
}

export const HomeScreenStartButtonEmber = ({ children, isLoading, onPress, style, testID }: Props) => {
    const { theme } = use(ThemeContext);
    const reduceMotion = useReducedMotion();
    const shakeOffset = useSharedValue(0);
    const idlePulse = useSharedValue(0);

    useEffect(() => {
        if (!reduceMotion) {
            shakeOffset.value = withSequence(
                withTiming(-HomeScreenStartButtonEmberShakeBurstDistance, { duration: HomeScreenStartButtonEmberShakeSegmentDurationMs }),
                withTiming(HomeScreenStartButtonEmberShakeBurstDistance, { duration: HomeScreenStartButtonEmberShakeSegmentDurationMs }),
                withTiming(-HomeScreenStartButtonEmberShakeBurstDistance / 2, {
                    duration: HomeScreenStartButtonEmberShakeSegmentDurationMs
                }),
                withTiming(0, { duration: HomeScreenStartButtonEmberShakeSegmentDurationMs })
            );

            idlePulse.value = withDelay(
                HomeScreenStartButtonEmberShakeBurstDurationMs,
                withRepeat(
                    withSequence(
                        withTiming(1, { duration: HomeScreenStartButtonEmberIdlePulseDurationMs, easing: Easing.inOut(Easing.ease) }),
                        withTiming(0, { duration: HomeScreenStartButtonEmberIdlePulseDurationMs, easing: Easing.inOut(Easing.ease) })
                    ),
                    -1,
                    false
                )
            );
        }

        return () => {
            cancelAnimation(shakeOffset);
            cancelAnimation(idlePulse);
        };
    }, [reduceMotion, shakeOffset, idlePulse]);

    const emberAnimatedStyle = useAnimatedStyle(() => ({
        shadowOpacity: HomeScreenStartButtonEmberGlowRestOpacity + idlePulse.value * HomeScreenStartButtonEmberGlowPulseOpacity,
        transform: [{ translateX: shakeOffset.value }, { scale: 1 + idlePulse.value * HomeScreenStartButtonEmberIdlePulseScale }]
    }));

    const wrapperUnistyles = reduceMotion
        ? [styles.emberWrapper, styles.emberGlow, styles.emberStaticGlow]
        : [styles.emberWrapper, styles.emberGlow];
    const animatedStyles = reduceMotion ? [] : [emberAnimatedStyle];
    const emberWrapperStyle = [...wrapperUnistyles.map(resolveUnistyleForAnimated), ...animatedStyles];
    const emberWrapperTestId = reduceMotion
        ? HomeScreenStartButtonEmberSelectors.StaticRoot
        : HomeScreenStartButtonEmberSelectors.AnimatedRoot;
    const emberButtonWrapperStyle = [style, styles.emberButton, { backgroundColor: theme.colors.danger }];

    return (
        <Animated.View style={emberWrapperStyle} testID={emberWrapperTestId}>
            <AppButton
                isLoading={isLoading}
                onPress={onPress}
                size="large"
                style={emberButtonWrapperStyle}
                testID={testID}
                variant="primary"
            >
                {children}
            </AppButton>
        </Animated.View>
    );
};
