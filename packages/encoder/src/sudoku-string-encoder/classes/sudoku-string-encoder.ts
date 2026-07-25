import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, VALUE_BITS } from '../../@generic/constants/bit-encoding.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';
import { isValidCellIndex } from '../../@generic/utils/is-valid-cell-index.util';
import { isValidCellValue } from '../../@generic/utils/is-valid-cell-value.util';
import { stringToUint8Array } from '../../@generic/utils/string-to-uint8array.util';

import type { SolutionStepInterface } from '../../@generic/interfaces/solution-step.interface';

export class SudokuStringEncoder {
    private readonly bitsPerClue = CELL_INDEX_BITS + VALUE_BITS;

    encode(sudokuString: string, steps: SolutionStepInterface[] = []): string {
        if (sudokuString.length !== GRID_CELL_COUNT) {
            return '';
        }

        const initial = this.removeStepsFromSudokuString(sudokuString, steps);

        const out = new BitOutputStream();
        for (let i = 0; i < initial.length; i += 1) {
            const char = initial.charAt(i);
            if (char !== GRID_EMPTY_CELL) {
                out.write(i, CELL_INDEX_BITS);
                out.write(parseInt(char, 10), VALUE_BITS);
            }
        }

        return String.fromCharCode(...out.bytes());
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

    private removeStepsFromSudokuString(sudokuString: string, solutionSteps: SolutionStepInterface[]): string {
        const chars = sudokuString.split('');

        for (const step of solutionSteps) {
            chars[step.cellIndex] = GRID_EMPTY_CELL;
        }

        return chars.join('');
    }

    private getCluesFromInput(input: string): Record<number, number> {
        const clues: Record<number, number> = {};
        const inputStream = new BitInputStream(stringToUint8Array(input));

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
