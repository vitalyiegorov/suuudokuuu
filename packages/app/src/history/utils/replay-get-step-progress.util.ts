import { isPositiveNumber } from '@rnw-community/shared';

export const replayGetStepProgress = (currentStep: number, totalSteps: number): number => {
    if (!isPositiveNumber(totalSteps)) {
        return 0;
    }

    const lowerBoundedStep = Math.max(currentStep, 0);
    const boundedStep = Math.min(lowerBoundedStep, totalSteps);

    return boundedStep / totalSteps;
};
