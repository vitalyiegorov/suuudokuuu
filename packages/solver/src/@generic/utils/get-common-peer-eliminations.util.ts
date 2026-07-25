import { isSameCell } from './is-same-cell.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CandidateEliminationInterface } from '../interfaces/candidate-elimination.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getCommonPeerEliminations = (
    context: CandidateContext,
    cells: CellInterface[],
    value: number,
    reasonCells: CellInterface[]
): CandidateEliminationInterface[] =>
    context
        .getCommonPeers(cells)
        .filter(cell => !reasonCells.some(reasonCell => isSameCell(reasonCell, cell)))
        .filter(cell => context.getCandidates(cell).includes(value))
        .map(cell => ({ cell, value }));
