import { AbstractTechnique } from './abstract-technique';
import { CandidateContext } from './candidate-context/candidate-context';

import type { CellInterface } from '@suuudokuuu/generator';

export abstract class AbstractChainTechnique extends AbstractTechnique {
    protected getBivalueCells(context: CandidateContext): CellInterface[] {
        return context.getBlankCells().filter(cell => this.isBivalueCell(context, cell));
    }

    protected isBivalueCell(context: CandidateContext, cell: CellInterface): boolean {
        return context.getCandidates(cell).length === 2;
    }

    protected getUniqueCells(cells: CellInterface[]): CellInterface[] {
        const cellMap: Record<string, CellInterface> = {};

        for (const cell of cells) {
            cellMap[CandidateContext.getCellKey(cell)] = cell;
        }

        return Object.values(cellMap);
    }
}
