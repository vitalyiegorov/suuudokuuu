import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

export const compareChainLengths = (firstResult: TechniqueResultInterface, secondResult: TechniqueResultInterface): number =>
    (firstResult.chainLength ?? 0) - (secondResult.chainLength ?? 0);
