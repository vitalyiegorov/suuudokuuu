import { Sudoku } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum, TechniqueManager } from '@suuudokuuu/techniques';

import { SE_RATING_CEILING } from '../constants/se-rating-ceiling.constant';
import { seTechniqueOrder } from '../constants/se-technique-order.constant';
import { seTechniqueRatings } from '../constants/se-technique-rating.constant';

import { getCeilingReason } from './get-ceiling-reason.util';
import { getStepRating } from './get-step-rating.util';

import type { PuzzleRatingInterface } from '../interfaces/puzzle-rating.interface';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const takeHardestRating = (hardest: PuzzleRatingInterface, step: TechniqueResultInterface): PuzzleRatingInterface => {
    const stepRating = getStepRating(step);

    if (stepRating <= hardest.rating) {
        return hardest;
    }

    return { rating: stepRating, hardestTechnique: step.technique, isCeiling: false };
};

export const ratePuzzle = (puzzleString: string): PuzzleRatingInterface => {
    const solveResult = new TechniqueManager(Sudoku.fromString(puzzleString)).solveLogically(seTechniqueOrder);

    if (solveResult.outcome !== 'solved') {
        return {
            rating: SE_RATING_CEILING,
            hardestTechnique: SolutionTechniqueEnum.Guess,
            isCeiling: true,
            ceilingReason: getCeilingReason(solveResult)
        };
    }

    const trivialRating: PuzzleRatingInterface = {
        rating: seTechniqueRatings[SolutionTechniqueEnum.FullHouse],
        hardestTechnique: SolutionTechniqueEnum.FullHouse,
        isCeiling: false
    };

    return solveResult.steps.reduce(takeHardestRating, trivialRating);
};
