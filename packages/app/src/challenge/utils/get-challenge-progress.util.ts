import type { SolutionStepInterface } from '@suuudokuuu/encoder';

export const getChallengeProgress = (steps: SolutionStepInterface[], totalTime: number, elapsedTime: number) => {
    let cumulativeTime = 0;
    let progress = 0;

    const indicators: number[] = [];
    for (const step of steps) {
        cumulativeTime += step.ts;
        indicators.push((cumulativeTime / totalTime) * 100);

        if (cumulativeTime < elapsedTime) {
            progress = cumulativeTime / totalTime;
        }
    }

    return [indicators, progress] as const;
};
