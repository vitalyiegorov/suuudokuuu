import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';

import type { CandidateMapType } from '../../../src/@generic/types/candidate-map.type';
import type { CandidateCellSpecType } from '../types/candidate-cell-spec.spec.type';

export const createCandidateContextFromMap = (...candidateSpecs: CandidateCellSpecType[]): CandidateContext => {
    const field = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig).Field;
    const candidateMap: CandidateMapType = {};

    for (const [rowIndex, columnIndex, candidates] of candidateSpecs) {
        candidateMap[CandidateContext.getCellKey(field[rowIndex][columnIndex])] = candidates;
    }

    return new CandidateContext(defaultSudokuConfig, field, candidateMap);
};
