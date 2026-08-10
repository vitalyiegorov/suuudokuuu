import { useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';

import { replayGetStepFromPosition } from '../../../utils/replay-get-step-from-position.util';

import type { LayoutChangeEvent } from 'react-native';

interface Parameters {
    readonly onScrubStep: (step: number) => void;
    readonly totalSteps: number;
}

const ScrubberGestureActiveOffsetX = 10;
const ScrubberGestureFailOffsetY = 12;
const ScrubberTapMaxDurationMs = 250;

export const useReplayScrubberGesture = ({ onScrubStep, totalSteps }: Parameters) => {
    const [railWidth, setRailWidth] = useState(0);

    const handleRailLayout = (event: LayoutChangeEvent) => {
        setRailWidth(event.nativeEvent.layout.width);
    };

    const scrubToPosition = (positionX: number) => {
        onScrubStep(replayGetStepFromPosition(positionX, railWidth, totalSteps));
    };

    const scrubberTapGesture = Gesture.Tap()
        .runOnJS(true)
        .maxDistance(ScrubberGestureActiveOffsetX)
        .maxDuration(ScrubberTapMaxDurationMs)
        .onEnd((event, success) => {
            if (success) {
                scrubToPosition(event.x);
            }
        });
    const scrubberPanGesture = Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-ScrubberGestureActiveOffsetX, ScrubberGestureActiveOffsetX])
        .failOffsetY([-ScrubberGestureFailOffsetY, ScrubberGestureFailOffsetY])
        .onUpdate(event => {
            scrubToPosition(event.x);
        })
        .onEnd((event, success) => {
            if (success) {
                scrubToPosition(event.x);
            }
        });
    const scrubberGesture = Gesture.Race(scrubberTapGesture, scrubberPanGesture);

    return { handleRailLayout, scrubberGesture };
};
