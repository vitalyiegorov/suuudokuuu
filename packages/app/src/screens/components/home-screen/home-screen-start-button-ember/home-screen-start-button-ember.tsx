import { AppButton, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { useEffect } from 'react';
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import {
    HomeScreenStartButtonEmberEntranceDurationMs,
    HomeScreenStartButtonEmberEntranceEasingFirstX,
    HomeScreenStartButtonEmberEntranceEasingFirstY,
    HomeScreenStartButtonEmberEntranceEasingSecondX,
    HomeScreenStartButtonEmberEntranceEasingSecondY,
    HomeScreenStartButtonEmberEntranceScale
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
    const reduceMotion = useReducedMotion();
    const entrance = useSharedValue(0);

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
        }

        return () => void cancelAnimation(entrance);
    }, [reduceMotion, entrance]);

    const entranceStyle = useAnimatedStyle(() => ({
        transform: [{ scale: HomeScreenStartButtonEmberEntranceScale + entrance.value * (1 - HomeScreenStartButtonEmberEntranceScale) }]
    }));

    const animatedStyles = reduceMotion ? [] : [entranceStyle];
    const emberWrapperStyle = [resolveUnistyleForAnimated(styles.emberWrapper), ...animatedStyles];
    const emberWrapperTestId = reduceMotion
        ? HomeScreenStartButtonEmberSelectors.StaticRoot
        : HomeScreenStartButtonEmberSelectors.AnimatedRoot;
    const emberButtonWrapperStyle = [style, resolveUnistyleForAnimated(styles.emberButton)];

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
