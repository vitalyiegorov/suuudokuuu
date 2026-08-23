import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const gameApplyTechniqueUsageDelta = (
    techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>,
    technique: SolutionTechniqueEnum,
    delta: number
): void => {
    const nextCount = (techniqueUsageCounts[technique] ?? 0) + delta;

    if (nextCount > 0) {
        techniqueUsageCounts[technique] = nextCount;
    } else {
        Reflect.deleteProperty(techniqueUsageCounts, technique);
    }
};
