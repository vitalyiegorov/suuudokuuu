import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

export const applyTechniqueStep = (context: CandidateContext, step: TechniqueResultInterface): CandidateContext => {
    const eliminatedContext = context.withEliminations(step.eliminations);

    return step.kind === 'placement' ? eliminatedContext.withPlacement(step.cell, step.value) : eliminatedContext;
};
