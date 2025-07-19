import { describe, expect, it } from '@jest/globals';

import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import { SerializableSudoku } from './serializable-sudoku';

describe('serializableSudoku', () => {
    it('should create from string', () => {
        expect.assertions(5);

        const testFieldsString =
            '875469123469123875123875469784596231596231784231784596658947312947312658312658947|...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku.Field[0][0].value).toStrictEqual(defaultSudokuConfig.blankCellValue);
        expect(sudoku.Field[0][3].value).toBe(4);
        expect(sudoku.Field[8][8].value).toStrictEqual(defaultSudokuConfig.blankCellValue);
        expect(sudoku.FullField[8][7].value).toBe(4);

        expect(sudoku.toString()).toStrictEqual(testFieldsString);
    });

    it('should validate fields string length', () => {
        expect.assertions(3);

        const wrongLength =
            '75469123469123875123875469784596231596231784231784596658947312947312658312658947|...469123469123875123875469784596...596231784231784596658947312947312658312658...';
        const noSeparator =
            '754691234691238751238754697845962315962317842317845966589473129473126582312658947]...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        expect(() => SerializableSudoku.fromString('', defaultSudokuConfig)).toThrow('Empty string passed');
        expect(() => SerializableSudoku.fromString(wrongLength, defaultSudokuConfig)).toThrow('String length is wrong');
        expect(() => SerializableSudoku.fromString(noSeparator, defaultSudokuConfig)).toThrow('No field separator');
    });
});
