import {
    SE_CHAIN_LENGTH_INCREMENT,
    SE_CHAIN_LENGTH_THRESHOLDS,
    SE_RATING_DECIMAL_SCALE,
    seLengthPricedBandMaximums
} from '../constants/se-chain-rating.constant';
import { seTechniqueRatings } from '../constants/se-technique-rating.constant';

import type { SolutionTechniqueEnum, TechniqueResultInterface } from '@suuudokuuu/techniques';

const NOT_LENGTH_PRICED_MAXIMUM = 0;

const getBandMaximum = (technique: SolutionTechniqueEnum): number => seLengthPricedBandMaximums.get(technique) ?? NOT_LENGTH_PRICED_MAXIMUM;

const getChainLengthDifficulty = (chainLength: number): number =>
    SE_CHAIN_LENGTH_THRESHOLDS.filter(threshold => chainLength > threshold).length * SE_CHAIN_LENGTH_INCREMENT;

export const getStepRating = (step: TechniqueResultInterface): number => {
    const techniqueRating = seTechniqueRatings[step.technique];
    const bandMaximum = getBandMaximum(step.technique);
    const chainLength = step.chainLength ?? 0;

    if (bandMaximum === NOT_LENGTH_PRICED_MAXIMUM || chainLength <= 0) {
        return techniqueRating;
    }

    const chainRating =
        Math.round((techniqueRating + getChainLengthDifficulty(chainLength)) * SE_RATING_DECIMAL_SCALE) / SE_RATING_DECIMAL_SCALE;

    return Math.min(chainRating, bandMaximum);
};
