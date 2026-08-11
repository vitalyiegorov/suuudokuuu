import { Text, View } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { mixColors } from '../../theme/utils/mix-colors.util';

import type { ComponentType } from 'react';

const enteringAnimation = {
    delay: () => enteringAnimation,
    duration: () => enteringAnimation
};

export const FadeIn = enteringAnimation;

const createAnimatedComponent = <Props,>(component: ComponentType<Props>): ComponentType<Props> => component;

export const useSharedValue = <Value,>(initialValue: Value) => ({ value: initialValue });

export const useDerivedValue = <Value,>(factory: () => Value) => ({ value: factory() });

export const withSpring = <Value,>(toValue: Value) => toValue;

export const withTiming = <Value,>(toValue: Value) => toValue;

export const withRepeat = <Value,>(animation: Value) => animation;

export const withDelay = <Value,>(_delayMs: number, animation: Value) => animation;

export const useReducedMotion = () => false;

export const cancelAnimation = emptyFn;

export const useAnimatedStyle = <Style extends object>(factory: () => Style) => factory();

export const Easing = {
    inOut: (easing: unknown) => easing,
    linear: (value: number) => value,
    out: (easing: unknown) => easing,
    ease: (value: unknown) => value,
    cubic: (value: unknown) => value
};

export const interpolate = (value: number, inputRange: readonly number[], outputRange: readonly number[]) => {
    const inputSpan = inputRange[inputRange.length - 1] - inputRange[0];
    const outputSpan = outputRange[outputRange.length - 1] - outputRange[0];
    const progress = inputSpan === 0 ? 0 : (value - inputRange[0]) / inputSpan;

    return outputRange[0] + outputSpan * progress;
};

export const interpolateColor = (value: number, inputRange: readonly number[], outputRange: readonly string[]): string => {
    const clampedValue = Math.min(Math.max(value, inputRange[0]), inputRange[inputRange.length - 1]);
    const upperIndex = inputRange.findIndex(input => input >= clampedValue);
    const boundedUpperIndex = upperIndex === -1 ? inputRange.length - 1 : upperIndex;
    const lowerIndex = Math.max(boundedUpperIndex - 1, 0);
    const lowerInput = inputRange[lowerIndex];
    const upperInput = inputRange[boundedUpperIndex];
    const segmentProgress = upperInput === lowerInput ? 0 : (clampedValue - lowerInput) / (upperInput - lowerInput);

    return mixColors(outputRange[lowerIndex], outputRange[boundedUpperIndex], segmentProgress);
};

export default { View, Text, createAnimatedComponent };
