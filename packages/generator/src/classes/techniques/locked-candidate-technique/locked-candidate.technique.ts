import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class LockedCandidateTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.LockedCandidate, 5, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        const results = new Set<number>();
        for (const candidate of this.sudoku.getCellCandidates(cell)) {
            const otherGroupRowColCellsWithCandidate = this.getGroupCells(cell).filter(
                groupCell =>
                    this.sudoku.isBlankCell(groupCell) &&
                    (groupCell.x === cell.x || groupCell.y === cell.y) &&
                    !this.sudoku.isSameCell(groupCell, cell) &&
                    this.sudoku.getCellCandidates(groupCell).includes(candidate)
            );

            if (this.isCandidateEliminatedByPointing(cell, candidate) && otherGroupRowColCellsWithCandidate.length <= 1) {
                results.add(candidate);
            }
        }

        return results.size === 1 ? [...results][0] : null;
    }

    private isCandidateEliminatedByPointing(cell: CellInterface, candidate: number): boolean {
        const otherGroupCellsWithCandidate = this.getGroupCells(cell).filter(
            groupCell =>
                this.sudoku.isBlankCell(groupCell) &&
                groupCell.x !== cell.x &&
                groupCell.y !== cell.y &&
                this.sudoku.getCellCandidates(groupCell).includes(candidate)
        );

        const eliminatedCells = new Set<CellInterface>();
        for (const otherGroupCell of otherGroupCellsWithCandidate) {
            const rowCells = this.getRowCells(otherGroupCell.y).filter(
                rowCell =>
                    rowCell.group !== cell.group && this.sudoku.isBlankCell(rowCell) && !this.sudoku.isSameCell(rowCell, otherGroupCell)
            );

            const eliminatingCandidateRowCells = rowCells.filter(rowCell => this.sudoku.getCellCandidates(rowCell).includes(candidate));

            const colCells = this.getColCells(otherGroupCell.x).filter(
                colCell =>
                    colCell.group !== cell.group && this.sudoku.isBlankCell(colCell) && !this.sudoku.isSameCell(colCell, otherGroupCell)
            );

            const eliminatingCandidateColCells = colCells.filter(colCell => this.sudoku.getCellCandidates(colCell).includes(candidate));

            if (
                (!this.hasCandidatesInOtherCols(colCells, otherGroupCell.x, candidate) && eliminatingCandidateRowCells.length >= 2) ||
                (!this.hasCandidatesInOtherRows(rowCells, otherGroupCell.y, candidate) && eliminatingCandidateColCells.length >= 2)
            ) {
                eliminatedCells.add(otherGroupCell);
            }
        }

        return otherGroupCellsWithCandidate.length > 0 && otherGroupCellsWithCandidate.length === eliminatedCells.size;
    }

    private hasCandidatesInOtherRows(rowCells: CellInterface[], row: number, candidate: number): boolean {
        for (const rowCell of rowCells) {
            const otherRowsInRowGroupCells = this.getGroupCells(rowCell).filter(
                rowGroupCell =>
                    rowGroupCell.y !== row &&
                    this.sudoku.isBlankCell(rowGroupCell) &&
                    this.sudoku.getCellCandidates(rowGroupCell).includes(candidate)
            );

            if (otherRowsInRowGroupCells.length > 0) {
                return true;
            }
        }

        return false;
    }

    private hasCandidatesInOtherCols(colCells: CellInterface[], col: number, candidate: number): boolean {
        for (const colCell of colCells) {
            const otherColsInColGroupCells = this.getGroupCells(colCell).filter(
                colGroupCell =>
                    colGroupCell.x !== col &&
                    this.sudoku.isBlankCell(colGroupCell) &&
                    this.sudoku.getCellCandidates(colGroupCell).includes(candidate)
            );

            if (otherColsInColGroupCells.length > 0) {
                return true;
            }
        }

        return false;
    }
}
