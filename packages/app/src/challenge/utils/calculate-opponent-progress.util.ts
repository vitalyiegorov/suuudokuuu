import type { SolutionStepInterface } from '../../history/interfaces/solution-step.interface';

export const calculateOpponentProgress = (steps: SolutionStepInterface[], elapsedTime: number): number => {
    let cumulativeTime = 0;
    let completedSteps = 0;

    for (const step of steps) {
        cumulativeTime += step.ts;
        if (cumulativeTime <= elapsedTime) {
            completedSteps += 1;
        } else {
            break;
        }
    }

    if (steps.length === 0) {
        return 0;
    }

    return (completedSteps / steps.length) * 100;
};
