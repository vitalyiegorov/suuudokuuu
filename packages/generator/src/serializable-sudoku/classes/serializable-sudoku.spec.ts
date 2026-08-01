import { describe, expect, it } from '@jest/globals';

import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../@generic/interfaces/sudoku-config.interface';

import { SerializableSudoku } from './serializable-sudoku';

class ExtendedSerializableSudoku extends SerializableSudoku {
    get marker(): string {
        return 'extended';
    }
}

describe('SerializableSudoku - Basic Operations', () => {
    it('should create from string', () => {
        expect.assertions(5);

        const testFieldsString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku.Field[0][0].value).toStrictEqual(defaultSudokuConfig.blankCellValue);
        expect(sudoku.Field[0][3].value).toBe(4);
        expect(sudoku.Field[8][8].value).toStrictEqual(defaultSudokuConfig.blankCellValue);
        expect(sudoku.FullField[8][7].value).toBe(4);

        expect(sudoku.toString()).toStrictEqual(testFieldsString);
    });

    it('should preserve the static factory receiver', () => {
        expect.assertions(2);

        const field = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';
        const sudoku = ExtendedSerializableSudoku.fromString(field, defaultSudokuConfig);

        expect(sudoku).toBeInstanceOf(ExtendedSerializableSudoku);
        expect(sudoku.marker).toBe('extended');
    });

    it('should validate fields string length', () => {
        expect.assertions(2);

        const wrongLength = '...469123469123875123875469784596...596231784231784596658947312947312658312658...2';

        expect(() => SerializableSudoku.fromString('', defaultSudokuConfig)).toThrow('Empty string passed');
        expect(() => SerializableSudoku.fromString(wrongLength, defaultSudokuConfig)).toThrow('String length is wrong');
    });

    it('should correctly calculate possible values', () => {
        expect.assertions(1);

        const testFieldsString = '....69123.69123875123875.6978.596...59623178.23178.5966589.73129.7312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku.PossibleValues).toStrictEqual([1, 2, 3, 4, 5, 7, 8, 9]);
    });
});

describe('SerializableSudoku - Difficulty Settings', () => {
    it('should set difficulty based on blank cells ratio', () => {
        expect.assertions(1);

        const testConfig = {
            ...defaultSudokuConfig,
            difficultyBlankCells: {
                [DifficultyEnum.Newbie]: 0.2,
                [DifficultyEnum.Easy]: 0.4,
                [DifficultyEnum.Medium]: 0.6,
                [DifficultyEnum.Hard]: 0.8,
                [DifficultyEnum.Nightmare]: 0.9,
                [DifficultyEnum.Hell]: 0.95
            }
        };

        const gameField = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const sudoku = SerializableSudoku.fromString(gameField, testConfig);

        expect(sudoku.Difficulty).toBe(DifficultyEnum.Newbie);
    });

    it('should get difficulty from config', () => {
        expect.assertions(1);

        const testFieldsString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku.Difficulty).toBe(DifficultyEnum.Newbie);
    });

    it('should report Hell for a field with 61-64 blank cells', () => {
        expect.assertions(1);

        const seventeenGivensFieldsString = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';

        const sudoku = SerializableSudoku.fromString(seventeenGivensFieldsString, defaultSudokuConfig);

        expect(sudoku.Difficulty).toBe(DifficultyEnum.Hell);
    });
});

describe('SerializableSudoku - Value Operations', () => {
    it('should get value progress for a specific value', () => {
        expect.assertions(1);

        const testFieldsString = '....69123.69123875123875.6978.596...59623178.23178.5966589.73129.7312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        const progress = sudoku.getValueProgress(4);

        expect(progress).toBeGreaterThanOrEqual(0);
    });

    it('should check if value is available for a cell', () => {
        expect.assertions(3);

        const testFieldsString = '....69123.69123875123875.6978.596...59623178.23178.5966589.73129.7312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku.isValueAvailable(undefined)).toBe(false);

        const cellWithAvailableValue = { x: 0, y: 0, group: 0, value: 4 };

        expect(sudoku.isValueAvailable(cellWithAvailableValue)).toBe(true);

        const cellWithCompletedValue = { x: 0, y: 0, group: 0, value: 6 };

        expect(sudoku.isValueAvailable(cellWithCompletedValue)).toBe(false);
    });
});

describe('SerializableSudoku - Error Handling', () => {
    it('should handle malformed field string (162 chars instead of 163)', () => {
        const malformedField = decodeURIComponent('...9..1...94........2..89.39...........2.....31....8...315...67.67..4....59.7..4');

        expect(() => {
            SerializableSudoku.fromString(malformedField, defaultSudokuConfig);
        }).toThrow('Invalid string format: String length is wrong for the given configuration');
    });

    it('should handle empty field string', () => {
        expect(() => {
            SerializableSudoku.fromString('', defaultSudokuConfig);
        }).toThrow('Invalid string format: Empty string passed');
    });

    it('should reject a field string that has no solution', () => {
        expect.assertions(1);

        const duplicatedGivens = '11';
        const contradictoryField = duplicatedGivens.padEnd(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize, '.');

        expect(() => SerializableSudoku.fromString(contradictoryField, defaultSudokuConfig)).toThrow(
            'Invalid string format: No solution found for the given field'
        );
    });
});

describe('SerializableSudoku - fromStrings', () => {
    const testFieldsString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

    it('should join the passed chunks into a single field', () => {
        expect.assertions(1);

        const chunkSize = 27;
        const chunks = [
            testFieldsString.slice(0, chunkSize),
            testFieldsString.slice(chunkSize, chunkSize * 2),
            testFieldsString.slice(chunkSize * 2)
        ];

        const sudoku = SerializableSudoku.fromStrings(defaultSudokuConfig, ...chunks);

        expect(sudoku.toString()).toStrictEqual(testFieldsString);
    });

    it('should preserve the static factory receiver', () => {
        expect.assertions(2);

        const sudoku = ExtendedSerializableSudoku.fromStrings(defaultSudokuConfig, testFieldsString);

        expect(sudoku).toBeInstanceOf(ExtendedSerializableSudoku);
        expect(sudoku.marker).toBe('extended');
    });

    it('should fall back to the default config and reject an empty chunk list', () => {
        expect.assertions(1);

        expect(() => SerializableSudoku.fromStrings()).toThrow('Invalid string format: Empty string passed');
    });
});

describe('SerializableSudoku - default config', () => {
    it('should adopt the default difficulty when no config is passed', () => {
        expect.assertions(1);

        const sudoku = new SerializableSudoku();

        expect(sudoku.Difficulty).toStrictEqual(defaultSudokuConfig.difficulty);
    });
});
