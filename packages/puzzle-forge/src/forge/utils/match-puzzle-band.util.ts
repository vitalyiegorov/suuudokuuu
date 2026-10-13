import { TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import type { DifficultyBandInterface } from '../../@generic/interfaces/difficulty-band.interface';
import type { PuzzleBandMatchInterface } from '../../@generic/interfaces/puzzle-band-match.interface';
import type { Sudoku } from '@suuudokuuu/generator';

export const createPuzzleBandMatcher = (band: DifficultyBandInterface): ((sudoku: Sudoku) => PuzzleBandMatchInterface) => {
    const ladderMaxTechnique = band.bandLadderMaxTechnique ?? band.simplerLadderMaxTechnique;
    const strategies = createTechniqueStrategies().filter(
        strategy => !isDefined(ladderMaxTechnique) || strategy.technique <= ladderMaxTechnique
    );

    return sudoku => {
        if (!isDefined(ladderMaxTechnique)) {
            return { isAboveSimplerLadder: true, isWithinBand: true };
        }

        const { outcome, steps } = new TechniqueManager(sudoku, strategies).solveLogically();
        const { simplerLadderMaxTechnique } = band;
        const isAboveSimplerLadder =
            !isDefined(simplerLadderMaxTechnique) || outcome !== 'solved' || steps.some(step => step.technique > simplerLadderMaxTechnique);

        return {
            isAboveSimplerLadder,
            isWithinBand: isAboveSimplerLadder && (!isDefined(band.bandLadderMaxTechnique) || outcome === 'solved')
        };
    };
};
