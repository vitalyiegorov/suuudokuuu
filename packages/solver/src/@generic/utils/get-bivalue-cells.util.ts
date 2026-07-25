import { isBivalueCell } from './is-bivalue-cell.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export const getBivalueCells = (context: CandidateContext): CellInterface[] =>
    context.getBlankCells().filter(cell => isBivalueCell(context, cell));
