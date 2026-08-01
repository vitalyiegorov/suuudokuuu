import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const createRandomPermutation = (size: number, random: SeededRandomType): number[] => {
    const permutation = Array.from({ length: size }, (_, index) => index);

    for (let index = size - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        const swappedValue = permutation[index];

        permutation[index] = permutation[swapIndex];
        permutation[swapIndex] = swappedValue;
    }

    return permutation;
};
