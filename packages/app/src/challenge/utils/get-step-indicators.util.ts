import type { SolutionStepInterface } from '../../history/interfaces/solution-step.interface';

export const getStepIndicators = (steps: SolutionStepInterface[], totalTime: number): number[] => {
    let cumulativeTime = 0;
    const indicators: number[] = [];

    for (const step of steps) {
        cumulativeTime += step.ts;
        indicators.push((cumulativeTime / totalTime) * 100);
    }

    return indicators;
};
