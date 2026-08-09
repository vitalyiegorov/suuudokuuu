import { View } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import type { ComponentType } from 'react';

const enteringAnimation = {
    delay: () => enteringAnimation,
    duration: () => enteringAnimation
};

export const FadeIn = enteringAnimation;

const createAnimatedComponent = <Props,>(component: ComponentType<Props>): ComponentType<Props> => component;

export const useSharedValue = <Value,>(initialValue: Value) => ({ value: initialValue });

export const withSpring = <Value,>(toValue: Value) => toValue;

export const withTiming = <Value,>(toValue: Value) => toValue;

export const useReducedMotion = () => false;

export const cancelAnimation = emptyFn;

export const useAnimatedStyle = <Style extends object>(factory: () => Style) => factory();

export const interpolate = (value: number, inputRange: readonly number[], outputRange: readonly number[]) => {
    const inputSpan = inputRange[inputRange.length - 1] - inputRange[0];
    const outputSpan = outputRange[outputRange.length - 1] - outputRange[0];
    const progress = inputSpan === 0 ? 0 : (value - inputRange[0]) / inputSpan;

    return outputRange[0] + outputSpan * progress;
};

export default { View, createAnimatedComponent };
