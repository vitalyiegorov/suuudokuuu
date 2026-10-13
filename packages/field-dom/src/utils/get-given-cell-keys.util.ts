import { getCellKey } from '@suuudokuuu/field-core';

const blankCellCharacter = '.';

export const getGivenCellKeys = (sudokuString: string): ReadonlySet<string> => {
    const fieldSize = Math.round(Math.sqrt(sudokuString.length));
    const givenCellKeys = new Set<string>();

    for (const [index, character] of Array.from(sudokuString).entries()) {
        if (character !== blankCellCharacter) {
            givenCellKeys.add(getCellKey({ x: index % fieldSize, y: Math.floor(index / fieldSize) }));
        }
    }

    return givenCellKeys;
};
