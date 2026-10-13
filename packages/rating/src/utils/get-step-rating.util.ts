import {
    SE_CHAIN_LENGTH_INCREMENT,
    SE_CHAIN_LENGTH_THRESHOLDS,
    SE_RATING_DECIMAL_SCALE,
    seLengthPricedBandMaximums
} from '../constants/se-chain-rating.constant';
import { seTechniqueRatings } from '../constants/se-technique-rating.constant';

import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const getChainLengthDifficulty = (chainLength: number): number =>
    SE_CHAIN_LENGTH_THRESHOLDS.filter(threshold => chainLength > threshold).length * SE_CHAIN_LENGTH_INCREMENT;

export const getStepRating = (step: TechniqueResultInterface): number => {
    const techniqueRating = seTechniqueRatings[step.technique];
    const bandMaximum = seLengthPricedBandMaximums.get(step.technique) ?? 0;
    const chainLength = step.chainLength ?? 0;

    if (bandMaximum <= 0 || chainLength <= 0) {
        return techniqueRating;
    }

    const chainRating =
        Math.round((techniqueRating + getChainLengthDifficulty(chainLength)) * SE_RATING_DECIMAL_SCALE) / SE_RATING_DECIMAL_SCALE;

    return Math.min(chainRating, bandMaximum);
};
