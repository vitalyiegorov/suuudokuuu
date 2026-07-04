import { Sudoku } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '@suuudokuuu/generator';

export class LockedCandidateTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.PointingPair, 5, sudoku);
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

            const columnCells = this.getColumnCells(otherGroupCell.x).filter(
                columnCell =>
                    columnCell.group !== cell.group &&
                    this.sudoku.isBlankCell(columnCell) &&
                    !this.sudoku.isSameCell(columnCell, otherGroupCell)
            );

            const eliminatingCandidateColumnCells = columnCells.filter(columnCell =>
                this.sudoku.getCellCandidates(columnCell).includes(candidate)
            );

            if (
                (!this.hasCandidatesInOtherColumns(columnCells, otherGroupCell.x, candidate) && eliminatingCandidateRowCells.length >= 2) ||
                (!this.hasCandidatesInOtherRows(rowCells, otherGroupCell.y, candidate) && eliminatingCandidateColumnCells.length >= 2)
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

    private hasCandidatesInOtherColumns(columnCells: CellInterface[], column: number, candidate: number): boolean {
        for (const columnCell of columnCells) {
            const otherColumnsInColumnGroupCells = this.getGroupCells(columnCell).filter(
                columnGroupCell =>
                    columnGroupCell.x !== column &&
                    this.sudoku.isBlankCell(columnGroupCell) &&
                    this.sudoku.getCellCandidates(columnGroupCell).includes(candidate)
            );

            if (otherColumnsInColumnGroupCells.length > 0) {
                return true;
            }
        }

        return false;
    }
}
