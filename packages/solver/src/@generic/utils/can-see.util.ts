import { isSameCell } from './is-same-cell.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export const canSee = (context: CandidateContext, cell: CellInterface, otherCell: CellInterface): boolean =>
    context.getPeers(cell).some(peer => isSameCell(peer, otherCell));
