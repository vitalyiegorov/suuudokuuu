import { useEffect } from 'react';
import { Animated } from 'react-native';

const ANIMATION_DURATION_MS = 300;

export const useProgressAnimation = (opponentProgress: number, progressAnim: Animated.Value): void => {
    useEffect(() => {
        Animated.timing(progressAnim, { toValue: opponentProgress, duration: ANIMATION_DURATION_MS, useNativeDriver: false }).start();
    }, [opponentProgress, progressAnim]);
};
