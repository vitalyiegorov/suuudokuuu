import type { FieldStepDotStateType } from '../types/field-step-dot-state.type';

export const getFieldStepDotState = (dotIndex: number, stepIndex: number): FieldStepDotStateType => {
    if (dotIndex === stepIndex) {
        return 'active';
    }

    return dotIndex < stepIndex ? 'done' : 'pending';
};
