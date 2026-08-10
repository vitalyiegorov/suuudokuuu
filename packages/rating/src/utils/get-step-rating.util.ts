import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import {
    SE_CHAIN_LENGTH_INCREMENT,
    SE_CHAIN_LENGTH_THRESHOLDS,
    SE_CHAIN_RATING_MAXIMUM,
    SE_RATING_DECIMAL_SCALE
} from '../constants/se-chain-rating.constant';
import { seTechniqueRatings } from '../constants/se-technique-rating.constant';

import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const isLengthRatedChainTechnique = (technique: SolutionTechniqueEnum): boolean =>
    technique === SolutionTechniqueEnum.XChain || technique === SolutionTechniqueEnum.XYChain;

const getChainLengthDifficulty = (chainLength: number): number =>
    SE_CHAIN_LENGTH_THRESHOLDS.filter(threshold => chainLength > threshold).length * SE_CHAIN_LENGTH_INCREMENT;

export const getStepRating = (step: TechniqueResultInterface): number => {
    const techniqueRating = seTechniqueRatings[step.technique];
    const chainLength = step.chainLength ?? 0;

    if (!isLengthRatedChainTechnique(step.technique) || chainLength <= 0) {
        return techniqueRating;
    }

    const chainRating =
        Math.round((techniqueRating + getChainLengthDifficulty(chainLength)) * SE_RATING_DECIMAL_SCALE) / SE_RATING_DECIMAL_SCALE;

    return Math.min(chainRating, SE_CHAIN_RATING_MAXIMUM);
};
