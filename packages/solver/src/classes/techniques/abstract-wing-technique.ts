import { isDefined } from '@rnw-community/shared';

import { AbstractTechnique } from './abstract-technique';

import type { CandidateContext } from './candidate-context/candidate-context';
import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractWingTechnique extends AbstractTechnique {
    protected hasSameCandidates(firstCandidates: number[], secondCandidates: number[]): boolean {
        return (
            firstCandidates.length === secondCandidates.length && firstCandidates.every(candidate => secondCandidates.includes(candidate))
        );
    }

    protected hasStrongLinkBetween(context: CandidateContext, firstCell: CellInterface, secondCell: CellInterface, value: number): boolean {
        for (const unit of context.getUnits()) {
            const cells = unit.cells.filter(cell => context.getCandidates(cell).includes(value));
            const [firstLinkCell, secondLinkCell] = cells;

            if (
                cells.length === 2 &&
                isDefined(firstLinkCell) &&
                isDefined(secondLinkCell) &&
                this.canSee(context, firstCell, firstLinkCell) &&
                this.canSee(context, secondCell, secondLinkCell)
            ) {
                return true;
            }

            if (
                cells.length === 2 &&
                isDefined(firstLinkCell) &&
                isDefined(secondLinkCell) &&
                this.canSee(context, firstCell, secondLinkCell) &&
                this.canSee(context, secondCell, firstLinkCell)
            ) {
                return true;
            }
        }

        return false;
    }

    protected canSee(context: CandidateContext, cell: CellInterface, otherCell: CellInterface): boolean {
        return context.getPeers(cell).some(peer => this.isSameCell(peer, otherCell));
    }
}
