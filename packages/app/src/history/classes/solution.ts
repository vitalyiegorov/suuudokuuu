import { isDefined } from '@rnw-community/shared';

import { SolutionStepInterface } from '../interfaces/solution-step.interface';

import type { CellInterface } from '@suuudokuuu/generator';

export class Solution {
    private readonly solutionStepStringLength = 6;
    private readonly maxTimestamp = 999;

    private steps: SolutionStepInterface[] = [];
    private totalElapsedTime = 0;

    stringify(): string {
        return this.steps.map(step => this.stepToString(step)).join('');
    }

    addStep(cell: CellInterface, elapsedTime: number): SolutionStepInterface {
        const timeDiff = elapsedTime - this.totalElapsedTime;
        const cappedTimeDiff = Math.min(timeDiff, this.maxTimestamp);

        const lastStep = {
            x: cell.x,
            y: cell.y,
            value: cell.value,
            ts: cappedTimeDiff
        };

        this.steps.push(lastStep);
        this.totalElapsedTime = elapsedTime;

        return lastStep;
    }

    getSteps(): SolutionStepInterface[] {
        return this.steps;
    }

    private parse(solutionSteps: string): SolutionStepInterface[] {
        if (!isDefined(solutionSteps) || solutionSteps.length % this.solutionStepStringLength !== 0) {
            return [];
        }

        this.steps = [];
        for (let i = 0; i < solutionSteps.length; i += this.solutionStepStringLength) {
            this.steps.push(this.stepFromString(solutionSteps.substring(i, i + this.solutionStepStringLength)));
        }

        return this.steps;
    }

    private stepToString(solutionStep: SolutionStepInterface): string {
        return `${solutionStep.x}${solutionStep.y}${solutionStep.value}${solutionStep.ts.toString().padStart(3, '0')}`;
    }

    private stepFromString(step: string): SolutionStepInterface {
        return {
            x: parseInt(step[0], 10),
            y: parseInt(step[1], 10),
            value: parseInt(step[2], 10),
            ts: parseInt(step.substring(3), 10)
        };
    }

    static fromString(solutionSteps: string): Solution {
        const solution = new Solution();

        solution.parse(solutionSteps);

        return solution;
    }

    static fromSteps(steps: SolutionStepInterface[]): Solution {
        const solution = new Solution();

        solution.steps = steps;

        return solution;
    }
}
