import type { StepScriptCandidateInterface } from '@suuudokuuu/field-core';

export interface GameHintPayloadInterface {
    readonly eliminations: StepScriptCandidateInterface[];
}
