import { describe, expect, it } from '@jest/globals';

import { DifficultyEnum } from '../../enums/difficulty.enum';
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

    it('should correctly calculate possible values', () => {
        expect.assertions(1);

        const testFieldsString =
            '875469123469123875123875469784596231596231784231784596658947312947312658312658947|....69123.69123875123875.6978.596...59623178.23178.5966589.73129.7312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku.PossibleValues).toStrictEqual([1, 2, 3, 4, 5, 7, 8, 9]);
    });

    it('should set difficulty based on blank cells ratio', () => {
        expect.assertions(1);

        const testConfig = {
            ...defaultSudokuConfig,
            difficultyBlankCells: {
                [DifficultyEnum.Newbie]: 0.2,
                [DifficultyEnum.Easy]: 0.4,
                [DifficultyEnum.Medium]: 0.6,
                [DifficultyEnum.Hard]: 0.8,
                [DifficultyEnum.Nightmare]: 0.9
            }
        };

        const completeField = '123456789'.repeat(9);
        const gameField = '1'.repeat(40) + '.'.repeat(41);
        const testFieldsString = `${completeField  }|${  gameField}`;

        const sudoku = SerializableSudoku.fromString(testFieldsString, testConfig);

        expect(sudoku.Difficulty).toBe(DifficultyEnum.Newbie);
    });

    it('should get difficulty from config', () => {
        expect.assertions(1);

        const testFieldsString =
            '875469123469123875123875469784596231596231784231784596658947312947312658312658947|...469123469123875123875469784596...596231784231784596658947312947312658312658...';

        const config = { ...defaultSudokuConfig, difficulty: DifficultyEnum.Easy };
        const sudoku = SerializableSudoku.fromString(testFieldsString, config);

        expect(sudoku.Difficulty).toBe(DifficultyEnum.Easy);
    });

    it('should get value progress for a specific value', () => {
        expect.assertions(1);

        const testFieldsString =
            '875469123469123875123875469784596231596231784231784596658947312947312658312658947|....69123.69123875123875.6978.596...59623178.23178.5966589.73129.7312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        const progress = sudoku.getValueProgress(4);

        expect(progress).toBeGreaterThanOrEqual(0);
    });

    it('should check if value is available for a cell', () => {
        expect.assertions(3);

        const testFieldsString =
            '875469123469123875123875469784596231596231784231784596658947312947312658312658947|....69123.69123875123875.6978.596...59623178.23178.5966589.73129.7312658312658...';

        const sudoku = SerializableSudoku.fromString(testFieldsString, defaultSudokuConfig);

        expect(sudoku.isValueAvailable(undefined)).toBe(false);

        const cellWithAvailableValue = { x: 0, y: 0, group: 0, value: 4 };

        expect(sudoku.isValueAvailable(cellWithAvailableValue)).toBe(true);

        const cellWithCompletedValue = { x: 0, y: 0, group: 0, value: 6 };

        expect(sudoku.isValueAvailable(cellWithCompletedValue)).toBe(false);
    });

    describe('fromString error handling', () => {
        it('should handle malformed field string (162 chars instead of 163)', () => {
            const malformedField = decodeURIComponent(
                '683957124594132786172468953926813475748295631315746892431589267867324519259671348%7C...9..1...94........2..89.39...........2.....31....8...315...67.67..4....59.7..4'
            );

            expect(() => {
                SerializableSudoku.fromString(malformedField, defaultSudokuConfig);
            }).toThrow('Invalid string format: String length is wrong for the given configuration');
        });

        it('should handle empty field string', () => {
            expect(() => {
                SerializableSudoku.fromString('', defaultSudokuConfig);
            }).toThrow('Invalid string format: Empty string passed');
        });

        it('should handle field without separator', () => {
            const expectedLength = defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize * 2 + 1;
            const fieldWithoutSeparator = 'A'.repeat(expectedLength);

            expect(() => {
                SerializableSudoku.fromString(fieldWithoutSeparator, defaultSudokuConfig);
            }).toThrow('Invalid string format: No field separator found');
        });
    });
});
