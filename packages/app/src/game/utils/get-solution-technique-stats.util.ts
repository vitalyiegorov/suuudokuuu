import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

import type { SolutionTechniqueStatsInterface } from '../interface/solution-technique-stats.interface';
import type { TechniqueResultInterface } from '@suuudokuuu/solver';

export const getSolutionTechniqueStats = (results: TechniqueResultInterface[]): SolutionTechniqueStatsInterface => {
    const countsByTechnique = new Map<number, number>();
    let guessLikeMoves = 0;
    let hardestTechnique = 0;

    for (const result of results) {
        countsByTechnique.set(result.technique, (countsByTechnique.get(result.technique) ?? 0) + 1);
        hardestTechnique = Math.max(hardestTechnique, result.technique);

        if (result.technique === SolutionTechniqueEnum.Guess) {
            guessLikeMoves += 1;
        }
    }

    return {
        countsByTechnique: Object.fromEntries(countsByTechnique),
        totalMoves: results.length,
        logicalMoves: results.length - guessLikeMoves,
        guessLikeMoves,
        hardestTechnique
    };
};
