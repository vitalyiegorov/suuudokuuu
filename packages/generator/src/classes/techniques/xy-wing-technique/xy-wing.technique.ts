import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class XYWingTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.XYWing, 15, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        return this.hasXYWingForValue(field, cell, value);
    }

    private hasXYWingForValue(field: FieldInterface, cell: CellInterface, _value: number): boolean {
        const candidates = this.getCellCandidates(field, cell);

        if (candidates.length !== 2) {
            return false;
        }

        const emptyCells = Array.from(this.getEmptyCells(field));
        const biValueCells = emptyCells.filter(checkCell => {
            const checkCandidates = this.getCellCandidates(field, checkCell);

            return checkCandidates.length === 2 && !(checkCell.x === cell.x && checkCell.y === cell.y);
        });

        for (const pivotCell of biValueCells) {
            const pivotCandidates = this.getCellCandidates(field, pivotCell);

            if (pivotCandidates.some(candidate => candidates.includes(candidate))) {
                const relatedCells = biValueCells.filter(relatedCell => {
                    const relatedCandidates = this.getCellCandidates(field, relatedCell);

                    return (
                        !(relatedCell.x === pivotCell.x && relatedCell.y === pivotCell.y) &&
                        !(relatedCell.x === cell.x && relatedCell.y === cell.y) &&
                        (this.shareUnit(relatedCell, pivotCell) || this.shareUnit(relatedCell, cell)) &&
                        relatedCandidates.some(candidate => pivotCandidates.includes(candidate))
                    );
                });

                if (relatedCells.length >= 1) {
                    return true;
                }
            }
        }

        return false;
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
