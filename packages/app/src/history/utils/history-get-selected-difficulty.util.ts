export const historyGetSelectedDifficulty = <Difficulty extends string>(
    difficulties: readonly Difficulty[],
    preferredDifficulty: Difficulty
) => {
    if (difficulties.includes(preferredDifficulty)) {
        return preferredDifficulty;
    }

    if (difficulties.length > 0) {
        return difficulties[0];
    }

    return preferredDifficulty;
};
