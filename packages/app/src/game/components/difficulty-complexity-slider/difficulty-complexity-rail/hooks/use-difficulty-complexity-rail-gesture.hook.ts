import { SpacingConstant } from '@suuudokuuu/ui';
import { useEffect, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

import { useReduceMotion } from '../../../../../@generic/hooks/use-reduce-motion.hook';
import { DifficultyComplexitySliderProgressAnimationDurationMs } from '../../constant/difficulty-complexity-slider.constant';

import type { LayoutChangeEvent } from 'react-native';

interface Parameters {
    readonly difficultyStopFraction: number;
    readonly maxDifficultyIndex: number;
    readonly onCommitDifficultyIndex: (difficultyIndex: number) => void;
    readonly optionCount: number;
}

const RailGestureActiveOffsetX = 10;
const RailGestureFailOffsetY = 12;
const RailTapMaxDuration = 250;
const RailGestureHitSlop = SpacingConstant.sm;
const RailInstantAnimationDurationMs = 0;

export const useDifficultyComplexityRailGesture = (parameters: Parameters) => {
    const { difficultyStopFraction, maxDifficultyIndex, onCommitDifficultyIndex, optionCount } = parameters;
    const isMotionReduced = useReduceMotion();
    const [railWidth, setRailWidth] = useState(0);
    const difficultyProgressValue = useSharedValue(difficultyStopFraction);
    const progressAnimationDurationMs = isMotionReduced
        ? RailInstantAnimationDurationMs
        : DifficultyComplexitySliderProgressAnimationDurationMs;

    useEffect(() => {
        difficultyProgressValue.value = withTiming(difficultyStopFraction, { duration: progressAnimationDurationMs });
    }, [difficultyStopFraction, progressAnimationDurationMs, difficultyProgressValue]);

    const handleRailLayout = (event: LayoutChangeEvent) => {
        setRailWidth(event.nativeEvent.layout.width);
    };

    const getClampedPositionFraction = (positionX: number): number => {
        'worklet';

        if (railWidth <= 0) {
            return 0;
        }

        const clampedPositionX = Math.min(Math.max(positionX, 0), railWidth);

        return clampedPositionX / railWidth;
    };

    const getDifficultyIndexFromFraction = (positionFraction: number): number => {
        'worklet';

        const rawDifficultyIndex = Math.floor(positionFraction * optionCount);

        return Math.min(Math.max(rawDifficultyIndex, 0), maxDifficultyIndex);
    };

    const updateDifficultyProgressWhileDragging = (positionX: number) => {
        'worklet';

        const positionFraction = getClampedPositionFraction(positionX);

        difficultyProgressValue.value = positionFraction;
        runOnJS(onCommitDifficultyIndex)(getDifficultyIndexFromFraction(positionFraction));
    };

    const settleDifficultyProgressFromPosition = (positionX: number) => {
        'worklet';

        const nextDifficultyIndex = getDifficultyIndexFromFraction(getClampedPositionFraction(positionX));

        difficultyProgressValue.value = withTiming((nextDifficultyIndex + 0.5) / optionCount, { duration: progressAnimationDurationMs });
        runOnJS(onCommitDifficultyIndex)(nextDifficultyIndex);
    };

    const railTapGesture = Gesture.Tap()
        .hitSlop({ bottom: RailGestureHitSlop, top: RailGestureHitSlop })
        .maxDistance(RailGestureActiveOffsetX)
        .maxDuration(RailTapMaxDuration)
        .onEnd((event, success) => {
            if (success) {
                settleDifficultyProgressFromPosition(event.x);
            }
        });
    const railPanGesture = Gesture.Pan()
        .activeOffsetX([-RailGestureActiveOffsetX, RailGestureActiveOffsetX])
        .failOffsetY([-RailGestureFailOffsetY, RailGestureFailOffsetY])
        .hitSlop({ bottom: RailGestureHitSlop, top: RailGestureHitSlop })
        .onUpdate(event => {
            updateDifficultyProgressWhileDragging(event.x);
        })
        .onEnd((event, success) => {
            if (success) {
                settleDifficultyProgressFromPosition(event.x);
            }
        });
    const railGesture = Gesture.Race(railTapGesture, railPanGesture);

    return { difficultyProgressValue, handleRailLayout, railGesture, railWidth };
};
