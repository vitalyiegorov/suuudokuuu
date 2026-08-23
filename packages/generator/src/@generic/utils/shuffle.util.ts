import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const shuffle = <T>(array: T[], random: SeededRandomType): T[] => {
    const clone = array.slice();

    for (let i = clone.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [clone[i], clone[j]] = [clone[j], clone[i]];
    }

    return clone;
};
