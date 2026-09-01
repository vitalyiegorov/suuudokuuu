const createInitialCombinationIndexes = (size: number): number[] => {
    const combinationIndexes: number[] = [];

    for (let position = 0; position < size; position += 1) {
        combinationIndexes.push(position);
    }

    return combinationIndexes;
};

const fillCombinationFromIndexes = <T>(items: readonly T[], combinationIndexes: number[], combination: T[], size: number): void => {
    for (let position = 0; position < size; position += 1) {
        combination[position] = items[combinationIndexes[position]];
    }
};

const advanceCombinationIndexes = (combinationIndexes: number[], itemCount: number, size: number): boolean => {
    let position = size - 1;

    while (position >= 0 && combinationIndexes[position] === itemCount - size + position) {
        position -= 1;
    }

    if (position < 0) {
        return false;
    }

    combinationIndexes[position] += 1;

    for (let nextPosition = position + 1; nextPosition < size; nextPosition += 1) {
        combinationIndexes[nextPosition] = combinationIndexes[nextPosition - 1] + 1;
    }

    return true;
};

export const forEachCombination = <T>(items: readonly T[], size: number, visitCombination: (combination: readonly T[]) => void): void => {
    if (items.length < size) {
        return;
    }

    const combinationIndexes = createInitialCombinationIndexes(size);
    const combination = new Array<T>(size);
    let hasMoreCombinations = true;

    while (hasMoreCombinations) {
        fillCombinationFromIndexes(items, combinationIndexes, combination, size);
        visitCombination(combination);
        hasMoreCombinations = advanceCombinationIndexes(combinationIndexes, items.length, size);
    }
};

export const getCombinations = <T>(items: readonly T[], size: number): T[][] => {
    const combinations: T[][] = [];

    forEachCombination(items, size, combination => {
        combinations.push([...combination]);
    });

    return combinations;
};
