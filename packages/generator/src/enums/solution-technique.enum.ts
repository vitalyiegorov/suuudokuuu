/* eslint-disable @typescript-eslint/no-magic-numbers */
export enum SolutionTechniqueEnum {
    Guess = 0,
    NakedSingle = 1,
    HiddenSingle = 2,
    NakedPair = 3,
    HiddenPair = 4,
    NakedTriple = 5,
    HiddenTriple = 6,
    NakedQuad = 7,
    HiddenQuad = 8,
    PointingPair = 9,
    BoxLineReduction = 10,
    XWing = 11,
    Swordfish = 12,
    Jellyfish = 13,
    XYWing = 14,
    XYZWing = 15
}
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const TECHNIQUE_BITS = 4;

const techniqueMaxValue = 15;

export const isValidTechnique = (technique: number): technique is SolutionTechniqueEnum =>
    technique >= 0 && technique <= techniqueMaxValue && Number.isInteger(technique);
