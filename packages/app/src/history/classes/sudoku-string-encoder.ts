import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { CELL_INDEX_BITS, VALUE_BITS } from '../constants/bit-encoding.constant';
import { SolutionStepInterface } from '../interfaces/solution-step.interface';
import { stringToUint8Array } from '../util/string-to-uint8array.util';

export class SudokuStringEncoder {
    private readonly gridSize = 9;
    private readonly totalCells = this.gridSize * this.gridSize;
    private readonly emptyCell = '.';
    //suuudokuuu://shared?eyJzIjoiQU1CVUc0UVFzaGpEa0lnUzRxQlpqQ0dvT1llcEFTTWtwSmlVSXFwYUM1bUVNdWFZMkp3anNua1BtZ2hDeUpVYnBJU29tVlBLaGxMcWlWbXNGYWE1bDdzQllreVZuRFNXcU5pYm00RnpEcVhhUEhlcytWK2tCNExRamhyRUdMTWFJNVNGa3pLaVcweDVwVGhucFFNPSIsImgiOiJUTFdJWWxXU0RsV1piRldlT0ZXZ1ZGV2lHRldsWnhXcVNSV3NjeFcwTFJXNEZSVzZFUlc4SmpYSWNEWE9XRFhTaURYVllEWFhuRFhZa0xYdVpMWHhIclgwZkxYM1JMWDRsdFgvZ3RZRFhOWUVRdFlJTk5ZS0hOWUxVdllRQnZZU1J2WVVhVFlXZVBZY012WWVFdllmZ1BZaW9IWW9oSFlwV25ZdFBuWXZJell5aXpZMWt6WTJPelk0SlRZNkN6WTdkVFk5bnBZK2RwWkFQSlpCZnBaRExuWklNSlpMREhaTUdwWk9GblpQIiwibSI6Ijk5In0=
    //suuudokuuu://shared?eyJzIjoiQU1CVUlKQVNoRlZOaWdoS2llVkRLelh1MVJ1YjFvYXhvamxLaVk4MGdBPT0iLCJoIjoiVExXSVlsV1NEbFdaYkZXZU9GV2dWRldpR0ZXbFp4V3FTUldzY3hXMExSVzRGUlc2RVJXOEpqWEljRFhPV0RYU2lEWFZZRFhYbkRYWWtMWHVaTFh4SHJYMGZMWDNSTFg0bHRYL2d0WURYTllFUXRZSU5OWUtITllMVXZZUUJ2WVNSdllVYVRZV2VQWWNNdlllRXZZZmdQWWlvSFlvaEhZcFduWXRQbll2SXpZeWl6WTFrelkyT3pZNEpUWTZDelk3ZFRZOW5wWStkcFpBUEpaQmZwWkRMblpJTUpaTERIWk1HcFpPRm5aUCIsIm0iOiI5OSJ9
    // https://suuudokuuu.com/shared?eyJzIjoiXHUwMDAwwFQgkFx1MDAxMoRVTYpcYkqJ5UMrNe7VXHUwMDFim9aGsaI5SomPNIAiLCJoIjoiTLWIYlWSXHUwMDBlVZlsVZ44VaBUVaJcdTAwMThVpWdcdTAwMTWqSVx1MDAxNaxzXHUwMDE1tC1cdTAwMTW4XHUwMDE1XHUwMDE1ulx1MDAxMVx1MDAxNbwmNchwNc5YNdKINdVgNdecNdiQte5ktfFcdTAwMWW19Hy190S1+JbV/4LWXHUwMDAzXFzWXHUwMDA0QtZcYjTWXG5cdTAwMWPWXHUwMDBiUvZcdTAwMTBcdTAwMDb2XHUwMDEyRvZcdTAwMTRpNlx1MDAxNnj2XHUwMDFjMvZcdTAwMWVcdTAwMTL2XHUwMDFmgPZcIqB2KIR2KVp2LT52LyM2Mos2NZM2Njs2OCU2Olx1MDAwYjY7dTY9npY+dpZAPJZBfpZDLnZIMJZLXGZ2TFx1MDAxYZZOXHUwMDE2dk8iLCJtIjoiOTkifQ==
    // http://127.0.0.1:8081/shared?eyJzIjoiXHUwMDAwwFQgkFx1MDAxMoRVTYpcYkqJ5UMrNe7VXHUwMDFim9aGsaI5SomPNIAiLCJoIjoiTLWIYlWSXHUwMDBlVZlsVZ44VaBUVaJcdTAwMThVpWdcdTAwMTWqSVx1MDAxNaxzXHUwMDE1tC1cdTAwMTW4XHUwMDE1XHUwMDE1ulx1MDAxMVx1MDAxNbwmNchwNc5YNdKINdVgNdecNdiQte5ktfFcdTAwMWW19Hy190S1+JbV/4LWXHUwMDAzXFzWXHUwMDA0QtZcYjTWXG5cdTAwMWPWXHUwMDBiUvZcdTAwMTBcdTAwMDb2XHUwMDEyRvZcdTAwMTRpNlx1MDAxNnj2XHUwMDFjMvZcdTAwMWVcdTAwMTL2XHUwMDFmgPZcIqB2KIR2KVp2LT52LyM2Mos2NZM2Njs2OCU2Olx1MDAwYjY7dTY9npY+dpZAPJZBfpZDLnZIMJZLXGZ2TFx1MDAxYZZOXHUwMDE2dk8iLCJtIjoiOTkifQ==

    encode(sudokuString: string, steps: SolutionStepInterface[] = []): string {
        if (sudokuString.length !== this.totalCells) {
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
            return this.emptyCell.repeat(this.totalCells);
        }

        const clues = this.getCluesFromInput(input);

        let result = '';
        for (let i = 0; i < this.totalCells; i += 1) {
            result += isDefined(clues[i]) ? clues[i].toString() : this.emptyCell;
        }

        return result;
    }

    // eslint-disable-next-line max-statements
    private getCluesFromInput(input: string): Record<number, number> {
        const clues: Record<number, number> = {};

        try {
            const inputStream = new BitInputStream(stringToUint8Array(input));
            do {
                const cellIndex = inputStream.read(CELL_INDEX_BITS);
                const value = inputStream.read(VALUE_BITS);

                if (cellIndex > this.totalCells - 1 || cellIndex < 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                if (value > this.gridSize || value <= 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                clues[cellIndex] = value;
            } while (inputStream.length > 0);
        } catch {
            return clues;
        }

        return clues;
    }
}
