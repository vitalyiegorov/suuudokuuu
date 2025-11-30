import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, VALUE_BITS } from '../constants/bit-encoding.constant';
import { GRID_CELL_COUNT } from '../constants/grid.constant';
import { SolutionStepInterface } from '../interfaces/solution-step.interface';
import { isValidCellIndex } from '../util/is-valid-cell-index.util';
import { isValidCellValue } from '../util/is-valid-cell-value.util';
import { stringToUint8Array } from '../util/string-to-uint8array.util';

const BITS_PER_CLUE = CELL_INDEX_BITS + VALUE_BITS;

export class SudokuStringEncoder {
    private readonly emptyCell = '.';

    encode(sudokuString: string, steps: SolutionStepInterface[] = []): string {
        if (sudokuString.length !== GRID_CELL_COUNT) {
            return '';
        }

        const initial = sudokuString.split('');
        for (const step of steps) {
            initial[step.cellIndex] = this.emptyCell;
        }

        const out = new BitOutputStream();
        for (let i = 0; i < initial.length; i += 1) {
            const char = initial[i];
            if (char !== this.emptyCell) {
                out.write(i, CELL_INDEX_BITS);
                out.write(parseInt(char, 10), VALUE_BITS);
            }
        }

        return String.fromCharCode(...out.bytes());
    }

    decode(input: string): string {
        if (!isNotEmptyString(input)) {
            return this.emptyCell.repeat(GRID_CELL_COUNT);
        }

        const clues = this.getCluesFromInput(input);

        let result = '';
        for (let i = 0; i < GRID_CELL_COUNT; i += 1) {
            result += isDefined(clues[i]) ? clues[i].toString() : this.emptyCell;
        }

        return result;
    }

    private getCluesFromInput(input: string): Record<number, number> {
        const clues: Record<number, number> = {};
        const inputStream = new BitInputStream(stringToUint8Array(input));

        while (inputStream.position + BITS_PER_CLUE <= inputStream.length) {
            const index = inputStream.read(CELL_INDEX_BITS);
            const value = inputStream.read(VALUE_BITS);

            if (isValidCellValue(value) && isValidCellIndex(index)) {
                clues[index] = value;
            }
        }

        return clues;
    }
}
