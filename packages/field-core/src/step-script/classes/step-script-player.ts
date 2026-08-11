import { isDefined } from '@rnw-community/shared';

import type { StepScriptTargetInterface } from '../interfaces/step-script-target.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';

export class StepScriptPlayer {
    private stepIndex = 0;

    constructor(private readonly script: StepScriptInterface) {}

    get Script(): StepScriptInterface {
        return this.script;
    }

    get StepIndex(): number {
        return this.stepIndex;
    }

    get CurrentStep(): StepScriptStepType | null {
        return this.script.steps[this.stepIndex] ?? null;
    }

    get IsFirstStep(): boolean {
        return this.stepIndex === 0;
    }

    get IsLastStep(): boolean {
        return this.stepIndex >= this.script.steps.length - 1;
    }

    next(): boolean {
        if (this.IsLastStep) {
            return false;
        }

        this.stepIndex += 1;

        return true;
    }

    back(): boolean {
        if (this.IsFirstStep) {
            return false;
        }

        this.stepIndex -= 1;

        return true;
    }

    reset(): void {
        this.stepIndex = 0;
    }

    applyResult(target: StepScriptTargetInterface): void {
        for (const elimination of this.script.eliminations) {
            target.removeCandidate(elimination.cell, elimination.value);
        }

        const { placement } = this.script;

        if (isDefined(placement)) {
            target.placeValue(placement.cell, placement.value);
        }
    }
}
