export interface FieldStepPlayerLabelsInterface {
    readonly stepPlayer: string;
    readonly previousStep: string;
    readonly nextStep: string;
    readonly resetSteps: string;
    readonly applySteps: string;
    readonly stepProgress: (step: number, stepCount: number) => string;
}
