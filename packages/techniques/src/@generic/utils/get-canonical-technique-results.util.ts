import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';

const getCandidateKey = (cell: TechniqueResultInterface['cell'], value: number): string => `${cell.y}:${cell.x}:${value}`;

const getDeductionKey = (result: TechniqueResultInterface): string => {
    const eliminationKey = result.eliminations
        .map(elimination => getCandidateKey(elimination.cell, elimination.value))
        .sort()
        .join(',');

    return `${result.technique}:${eliminationKey}`;
};

const getReasonPathKey = (result: TechniqueResultInterface): string => result.reasonCells.map(cell => `${cell.y}:${cell.x}`).join(',');

const compareResults = (firstResult: TechniqueResultInterface, secondResult: TechniqueResultInterface): number => {
    const reasonCellCountDifference = firstResult.reasonCells.length - secondResult.reasonCells.length;

    if (reasonCellCountDifference !== 0) {
        return reasonCellCountDifference;
    }

    return getReasonPathKey(firstResult).localeCompare(getReasonPathKey(secondResult));
};

export const getCanonicalTechniqueResults = (results: TechniqueResultInterface[]): TechniqueResultInterface[] => {
    const resultsByDeductionKey = new Map<string, TechniqueResultInterface>();

    for (const result of results) {
        const deductionKey = getDeductionKey(result);
        const existingResult = resultsByDeductionKey.get(deductionKey);

        if (!existingResult || compareResults(result, existingResult) < 0) {
            resultsByDeductionKey.set(deductionKey, result);
        }
    }

    return [...resultsByDeductionKey.entries()]
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([, result]) => result);
};
