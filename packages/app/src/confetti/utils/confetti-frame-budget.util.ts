import {
    winConfettiDegradationDelayMillisecondsConstant,
    winConfettiFrameBudgetMillisecondsConstant,
    winConfettiFrameSmoothingConstant
} from '../constants/win-confetti.constant';

export const getConfettiAverageFrameDuration = (previousAverage: number, frameDurationMilliseconds: number): number => {
    'worklet';

    if (previousAverage === 0) {
        return frameDurationMilliseconds;
    }

    return previousAverage + (frameDurationMilliseconds - previousAverage) * winConfettiFrameSmoothingConstant;
};

export const isConfettiFrameBudgetExceeded = (elapsedMilliseconds: number, averageFrameDuration: number): boolean => {
    'worklet';

    return (
        elapsedMilliseconds > winConfettiDegradationDelayMillisecondsConstant &&
        averageFrameDuration > winConfettiFrameBudgetMillisecondsConstant
    );
};
