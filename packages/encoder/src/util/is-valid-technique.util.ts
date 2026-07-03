import { SOLUTION_MAX_TECHNIQUE, SOLUTION_MIN_TECHNIQUE } from '../constants/solution-format.constant';

export const isValidTechnique = (technique: number): boolean =>
    Number.isInteger(technique) && technique >= SOLUTION_MIN_TECHNIQUE && technique <= SOLUTION_MAX_TECHNIQUE;
