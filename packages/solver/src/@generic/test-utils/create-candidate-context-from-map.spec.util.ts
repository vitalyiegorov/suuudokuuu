import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../classes/candidate-context/candidate-context';

import type { CandidateCellSpecType } from '../types/candidate-cell-spec.spec.type';
import type { CandidateMapType } from '../types/candidate-map.type';

export const createCandidateContextFromMap = (...candidateSpecs: CandidateCellSpecType[]): CandidateContext => {
    const field = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig).Field;
    const candidateMap: CandidateMapType = {};

    for (const [rowIndex, columnIndex, candidates] of candidateSpecs) {
        candidateMap[CandidateContext.getCellKey(field[rowIndex][columnIndex])] = candidates;
    }

    return new CandidateContext(defaultSudokuConfig, field, candidateMap);
};
