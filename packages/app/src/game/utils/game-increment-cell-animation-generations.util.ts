export const gameIncrementCellAnimationGenerations = (
    previousGenerations: Readonly<Record<string, number>>,
    cellKeysToAnimate: ReadonlySet<string>
): Record<string, number> => {
    const nextGenerations: Record<string, number> = { ...previousGenerations };

    cellKeysToAnimate.forEach(cellKey => {
        nextGenerations[cellKey] = (nextGenerations[cellKey] ?? 0) + 1;
    });

    return nextGenerations;
};
