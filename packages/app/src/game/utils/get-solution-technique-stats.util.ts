import type { SolutionTechniqueStatsInterface } from '../interface/solution-technique-stats.interface';
import type { SolutionStepInterface } from '@suuudokuuu/encoder';

export const getSolutionTechniqueStats = (steps: SolutionStepInterface[]): SolutionTechniqueStatsInterface => {
    const countsByTechnique: Record<number, number> = {};
    let guessLikeMoves = 0;
    let hardestTechnique = 0;

    for (const step of steps) {
        countsByTechnique[step.technique] = (countsByTechnique[step.technique] ?? 0) + 1;
        hardestTechnique = Math.max(hardestTechnique, step.technique);

        if (step.isGuessLike) {
            guessLikeMoves += 1;
        }
    }

    return {
        countsByTechnique,
        totalMoves: steps.length,
        logicalMoves: steps.length - guessLikeMoves,
        guessLikeMoves,
        hardestTechnique
    };
};
