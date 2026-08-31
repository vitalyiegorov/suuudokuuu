import { GameNumpadDigitsConstant } from '../constant/game-numpad-digits.constant';

import type { FieldInterface } from '@suuudokuuu/generator';

export const gameGetRemainingDigitCounts = (field: FieldInterface): Map<number, number> => {
    const placedCounts = new Map<number, number>();

    for (const row of field) {
        for (const cell of row) {
            placedCounts.set(cell.value, (placedCounts.get(cell.value) ?? 0) + 1);
        }
    }

    return new Map(GameNumpadDigitsConstant.map(digit => [digit, GameNumpadDigitsConstant.length - (placedCounts.get(digit) ?? 0)]));
};
