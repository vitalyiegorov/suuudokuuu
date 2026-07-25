export const getCombinations = <T>(items: T[], size: number): T[][] => {
    if (size === 0) {
        return [[]];
    }

    if (items.length < size) {
        return [];
    }

    const combinations: T[][] = [];

    for (let index = 0; index <= items.length - size; index += 1) {
        const item = items[index];
        const remainingItems = items.slice(index + 1);

        for (const combination of getCombinations(remainingItems, size - 1)) {
            combinations.push([item, ...combination]);
        }
    }

    return combinations;
};
