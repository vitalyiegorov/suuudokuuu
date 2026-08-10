import { isPositiveNumber } from '@rnw-community/shared';

export const replayGetStepFromPosition = (positionX: number, railWidth: number, totalSteps: number): number => {
    if (!isPositiveNumber(railWidth) || !isPositiveNumber(totalSteps)) {
        return 0;
    }

    const clampedPositionX = Math.min(Math.max(positionX, 0), railWidth);

    return Math.round((clampedPositionX / railWidth) * totalSteps);
};
