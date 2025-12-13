import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class NakedPairTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.NakedPair, 4, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (candidates.length !== 2 || !candidates.includes(value)) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasPairInUnit(field, rowCells, candidates, cell) ||
            this.hasPairInUnit(field, colCells, candidates, cell) ||
            this.hasPairInUnit(field, groupCells, candidates, cell)
        );
    }

    private hasPairInUnit(field: FieldInterface, unitCells: CellInterface[], candidates: number[], currentCell: CellInterface): boolean {
        let pairCount = 0;

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(field, unitCell);

                if (unitCandidates.length === 2 && unitCandidates.every(candidate => candidates.includes(candidate))) {
                    pairCount += 1;
                }
            }
        }

        return pairCount === 1;
    }
}
