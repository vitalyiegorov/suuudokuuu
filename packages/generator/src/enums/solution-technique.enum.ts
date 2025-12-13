/* eslint-disable @typescript-eslint/no-magic-numbers */
export enum SolutionTechniqueEnum {
    Guess = 0,
    FullHouse = 1,
    NakedSingle = 2,
    HiddenSingle = 3,
    NakedPair = 4,
    HiddenPair = 5,
    NakedTriple = 6,
    HiddenTriple = 7,
    NakedQuad = 8,
    HiddenQuad = 9,
    PointingPair = 10,
    BoxLineReduction = 11,
    XWing = 12,
    Swordfish = 13,
    Jellyfish = 14,
    XYWing = 15,
    XYZWing = 16
}
/* eslint-enable @typescript-eslint/no-magic-numbers */

export const TECHNIQUE_BITS = 5;

const techniqueMaxValue = 16;

export const isValidTechnique = (technique: number): technique is SolutionTechniqueEnum =>
    technique >= 0 && technique <= techniqueMaxValue && Number.isInteger(technique);
