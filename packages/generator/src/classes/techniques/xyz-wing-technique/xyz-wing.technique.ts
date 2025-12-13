import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class XYZWingTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.XYZWing, 16, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (candidates.length !== 3 || !candidates.includes(value)) {
            return false;
        }

        return this.hasXYZWingForValue(field, cell, value);
    }

    private hasXYZWingForValue(field: FieldInterface, cell: CellInterface, _value: number): boolean {
        const candidates = this.getCellCandidates(field, cell);
        const emptyCells = this.getEmptyCells(field);
        const biValueCells = emptyCells.filter(checkCell => {
            const checkCandidates = this.getCellCandidates(field, checkCell);

            return checkCandidates.length === 2 && !(checkCell.x === cell.x && checkCell.y === cell.y) && this.shareUnit(checkCell, cell);
        });

        let matchingWingCells = 0;

        for (const wingCell of biValueCells) {
            const wingCandidates = this.getCellCandidates(field, wingCell);
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
