import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class XYWingTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.XYWing, 15, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        for (const value of candidates) {
            if (this.hasXYWingForValue(cell, value)) {
                return true;
            }
        }

        return false;
    }

    private hasXYWingForValue(cell: CellInterface, _value: number): boolean {
        const candidates = this.getCellCandidates(cell);

        if (candidates.length !== 2) {
            return false;
        }

        const emptyCells = Array.from(this.getEmptyCells());
        const biValueCells = emptyCells.filter(checkCell => {
            const checkCandidates = this.getCellCandidates(checkCell);

            return checkCandidates.length === 2 && !(checkCell.x === cell.x && checkCell.y === cell.y);
        });

        for (const pivotCell of biValueCells) {
            const pivotCandidates = this.getCellCandidates(pivotCell);

            if (pivotCandidates.some(candidate => candidates.includes(candidate))) {
                const relatedCells = biValueCells.filter(relatedCell => {
                    const relatedCandidates = this.getCellCandidates(relatedCell);

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
