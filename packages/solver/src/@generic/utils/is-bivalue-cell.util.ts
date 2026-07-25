import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export const isBivalueCell = (context: CandidateContext, cell: CellInterface): boolean => context.getCandidates(cell).length === 2;
