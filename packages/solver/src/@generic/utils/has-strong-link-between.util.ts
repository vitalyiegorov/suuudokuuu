import { isDefined } from '@rnw-community/shared';

import { canSee } from './can-see.util';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export const hasStrongLinkBetween = (
    context: CandidateContext,
    firstCell: CellInterface,
    secondCell: CellInterface,
    value: number
): boolean => {
    for (const unit of context.getUnits()) {
        const cells = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
        const [firstLinkCell, secondLinkCell] = cells;

        if (
            cells.length === 2 &&
            isDefined(firstLinkCell) &&
            isDefined(secondLinkCell) &&
            canSee(context, firstCell, firstLinkCell) &&
            canSee(context, secondCell, secondLinkCell)
        ) {
            return true;
        }

        if (
            cells.length === 2 &&
            isDefined(firstLinkCell) &&
            isDefined(secondLinkCell) &&
            canSee(context, firstCell, secondLinkCell) &&
            canSee(context, secondCell, firstLinkCell)
        ) {
            return true;
        }
    }

    return false;
};
