export interface FieldStepPlayerLabelsInterface {
    stepPlayer: string;
    previousStep: string;
    nextStep: string;
    resetSteps: string;
    applySteps: string;
    stepProgress: (step: number, stepCount: number) => string;
}
