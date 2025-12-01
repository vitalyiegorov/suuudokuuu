import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, VALUE_BITS } from '../constants/bit-encoding.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../constants/grid.constant';
import { base64ToUint8Array } from '../util/base64-to-uint8array.util';
import { getOriginalSudokuString } from '../util/get-original-sudoku-string.util';
import { isValidCellIndex } from '../util/is-valid-cell-index.util';
import { isValidCellValue } from '../util/is-valid-cell-value.util';

import type { SolutionStepInterface } from '../interfaces/solution-step.interface';

export class SudokuStringEncoder {
    private readonly bitsPerClue = CELL_INDEX_BITS + VALUE_BITS;

    encode(sudokuString: string, steps: SolutionStepInterface[] = []): string {
        if (sudokuString.length !== GRID_CELL_COUNT) {
            return '';
        }

        const initial = getOriginalSudokuString(sudokuString, steps);

        const out = new BitOutputStream();
        for (let i = 0; i < initial.length; i += 1) {
            const char = initial[i];
            if (char !== GRID_EMPTY_CELL) {
                out.write(i, CELL_INDEX_BITS);
                out.write(parseInt(char, 10), VALUE_BITS);
            }
        }

        return btoa(String.fromCharCode(...out.bytes()));
    }

    decode(input: string): string {
        if (!isNotEmptyString(input)) {
            return GRID_EMPTY_CELL.repeat(GRID_CELL_COUNT);
        }

        const clues = this.getCluesFromInput(input);

        let result = '';
        for (let i = 0; i < GRID_CELL_COUNT; i += 1) {
            result += isDefined(clues[i]) ? clues[i].toString() : GRID_EMPTY_CELL;
        }

        return result;
    }

    private getCluesFromInput(input: string): Record<number, number> {
        const clues: Record<number, number> = {};
        const inputStream = new BitInputStream(base64ToUint8Array(input));

        while (inputStream.position + this.bitsPerClue <= inputStream.length) {
            const index = inputStream.read(CELL_INDEX_BITS);
            const value = inputStream.read(VALUE_BITS);

            if (isValidCellValue(value) && isValidCellIndex(index)) {
                clues[index] = value;
            }
        }

        return clues;
    }
}
