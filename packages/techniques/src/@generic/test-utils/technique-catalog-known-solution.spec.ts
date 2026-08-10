import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../classes/candidate-context/candidate-context';
import { createTechniqueStrategies } from '../utils/create-technique-strategies.util';

interface KnownSolutionBoardInterface {
    board: string[];
    solution: string;
}

interface UnsafeEliminationInterface {
    boardIndex: number;
    technique: number;
    rowIndex: number;
    columnIndex: number;
    value: number;
}

const sharedSolution = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

const knownSolutionBoards: KnownSolutionBoardInterface[] = [
    {
        board: ['.34678912', '6.2195348', '19.342567', '859.61423', '4268.3791', '71392.856', '961537.84', '2874196.5', '34528617.'],
        solution: sharedSolution
    },
    {
        board: ['53..7....', '6..195...', '.98....6.', '8...6...3', '4..8.3..1', '7...2...6', '.6....28.', '...419..5', '....8..79'],
        solution: sharedSolution
    },
    {
        board: ['5.4.7.9.2', '.7.1.5.4.', '1.8.4.5.7', '.5.7.1.2.', '4.6.5.7.1', '.1.9.4.5.', '9.1.3.2.4', '.8.4.9.3.', '3.5.8.1.9'],
        solution: sharedSolution
    },
    {
        board: ['534678912', '.........', '.........', '859761423', '.........', '.........', '961537284', '.........', '.........'],
        solution: sharedSolution
    },
    {
        board: ['534......', '672......', '198......', '...761...', '...853...', '...924...', '......284', '......635', '......179'],
        solution: sharedSolution
    },
    {
        board: ['891673254', '743125869', '625489137', '937...412', '268714395', '514932678', '186297543', '3.2.4.98.', '4.93..7..'],
        solution: '891673254743125869625489137937856412268714395514932678186297543372541986459368721'
    },
    {
        board: ['397856412', '.1.743965', '645219..8', '.7.624..1', '136578294', '...391..6', '...9.71.3', '781432659', '...1.58.7'],
        solution: '397856412218743965645219378879624531136578294452391786564987123781432659923165847'
    },
    {
        board: ['386179452', '7..654938', '4..328176', '.6.947315', '934215867', '.7.836294', '643581729', '...762543', '..7493681'],
        solution: '386179452712654938459328176268947315934215867175836294643581729891762543527493681'
    },
    {
        board: ['.7..26415', '.26..1987', '..19.7236', '..4692751', '197..5642', '652714893', '7..169524', '469253178', '215478369'],
        solution: '978326415326541987541987236834692751197835642652714893783169524469253178215478369'
    }
];

describe('technique catalog known-solution invariant', () => {
    it('never eliminates a value from a known valid completion', () => {
        expect.assertions(1);

        const unsafeEliminations: UnsafeEliminationInterface[] = [];

        knownSolutionBoards.forEach((knownSolutionBoard, boardIndex) => {
            const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...knownSolutionBoard.board);
            const context = CandidateContext.fromSudoku(sudoku);

            for (const strategy of createTechniqueStrategies()) {
                for (const result of strategy.find(context)) {
                    for (const elimination of result.eliminations) {
                        const knownValue = Number(
                            knownSolutionBoard.solution[elimination.cell.y * defaultSudokuConfig.fieldSize + elimination.cell.x]
                        );

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

    it('never places a value that contradicts a known valid completion', () => {
        expect.assertions(1);

        const unsafePlacements: UnsafeEliminationInterface[] = [];

        knownSolutionBoards.forEach((knownSolutionBoard, boardIndex) => {
            const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...knownSolutionBoard.board);
            const context = CandidateContext.fromSudoku(sudoku);

            for (const strategy of createTechniqueStrategies()) {
                for (const result of strategy.find(context).filter(candidate => candidate.kind === 'placement')) {
                    const knownValue = Number(knownSolutionBoard.solution[result.cell.y * defaultSudokuConfig.fieldSize + result.cell.x]);

                    if (result.value !== knownValue) {
                        unsafePlacements.push({
                            boardIndex,
                            technique: strategy.technique,
                            rowIndex: result.cell.y,
                            columnIndex: result.cell.x,
                            value: result.value
                        });
                    }
                }
            }
        });

        expect(unsafePlacements).toEqual([]);
    });
});
