import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../classes/candidate-context/candidate-context';
import { createTechniqueStrategies } from '../utils/create-technique-strategies.util';

interface UnsafeEliminationInterface {
    boardIndex: number;
    technique: number;
    rowIndex: number;
    columnIndex: number;
    value: number;
}

const knownSolution = ['534678912', '672195348', '198342567', '859761423', '426853791', '713924856', '961537284', '287419635', '345286179'];

const partialBoards = [
    ['.34678912', '6.2195348', '19.342567', '859.61423', '4268.3791', '71392.856', '961537.84', '2874196.5', '34528617.'],
    ['53..7....', '6..195...', '.98....6.', '8...6...3', '4..8.3..1', '7...2...6', '.6....28.', '...419..5', '....8..79'],
    ['5.4.7.9.2', '.7.1.5.4.', '1.8.4.5.7', '.5.7.1.2.', '4.6.5.7.1', '.1.9.4.5.', '9.1.3.2.4', '.8.4.9.3.', '3.5.8.1.9'],
    ['534678912', '.........', '.........', '859761423', '.........', '.........', '961537284', '.........', '.........'],
    ['534......', '672......', '198......', '...761...', '...853...', '...924...', '......284', '......635', '......179']
];

describe('technique catalog known-solution invariant', () => {
    it('never eliminates a value from a known valid completion', () => {
        expect.assertions(1);

        const unsafeEliminations: UnsafeEliminationInterface[] = [];

        partialBoards.forEach((partialBoard, boardIndex) => {
            const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...partialBoard);
            const context = CandidateContext.fromSudoku(sudoku);

            for (const strategy of createTechniqueStrategies()) {
                for (const result of strategy.find(context)) {
                    for (const elimination of result.eliminations) {
                        const knownValue = Number(knownSolution[elimination.cell.y][elimination.cell.x]);

                        if (elimination.value === knownValue) {
                            unsafeEliminations.push({
                                boardIndex,
                                technique: strategy.technique,
                                rowIndex: elimination.cell.y,
                                columnIndex: elimination.cell.x,
                                value: elimination.value
                            });
                        }
                    }
                }
            }
        });

        expect(unsafeEliminations).toEqual([]);
    });
});
