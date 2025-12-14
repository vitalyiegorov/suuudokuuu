import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class XYZWingTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.XYZWing, 16, sudoku);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length !== 3) {
            return false;
        }

        for (const value of candidates) {
            if (this.hasXYZWingForValue(field, cell, value)) {
                return true;
            }
        }

        return false;
    }

    private hasXYZWingForValue(field: FieldInterface, cell: CellInterface, _value: number): boolean {
        const candidates = this.getCellCandidates(cell);
        const emptyCells = this.getEmptyCells(field);
        const biValueCells = emptyCells.filter(checkCell => {
            const checkCandidates = this.getCellCandidates(checkCell);

            return checkCandidates.length === 2 && !(checkCell.x === cell.x && checkCell.y === cell.y) && this.shareUnit(checkCell, cell);
        });

        let matchingWingCells = 0;

        for (const wingCell of biValueCells) {
            const wingCandidates = this.getCellCandidates(wingCell);
            const sharedCandidates = wingCandidates.filter(candidate => candidates.includes(candidate));

            if (sharedCandidates.length === 2) {
                matchingWingCells += 1;
            }
        }

        return matchingWingCells >= 2;
    }

    private shareUnit(cell1: CellInterface, cell2: CellInterface): boolean {
        const sameRow = cell1.y === cell2.y;
        const sameCol = cell1.x === cell2.x;
        const sameGroup =
            Math.floor(cell1.x / this.config.fieldGroupWidth) === Math.floor(cell2.x / this.config.fieldGroupWidth) &&
            Math.floor(cell1.y / this.config.fieldGroupHeight) === Math.floor(cell2.y / this.config.fieldGroupHeight);

        return sameRow || sameCol || sameGroup;
    }
}
