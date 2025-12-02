import type { SolutionStepInterface } from '@suuudokuuu/encoder';

export const getStepIndicators = (steps: SolutionStepInterface[], totalTime: number): number[] => {
    let cumulativeTime = 0;
    const indicators: number[] = [];

    for (const step of steps) {
        cumulativeTime += step.ts;
        indicators.push((cumulativeTime / totalTime) * 100);
    }

    return indicators;
};
