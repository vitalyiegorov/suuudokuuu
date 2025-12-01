/* eslint-disable max-lines */
import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';

export interface TechniqueResultInterface {
    technique: SolutionTechniqueEnum;
    cell: CellInterface;
    value: number;
}

export class TechniqueIdentifier {
    private readonly config: SudokuConfigInterface;
    private readonly fieldFillingValues: number[];

    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        this.config = config;
        this.fieldFillingValues = Array.from({ length: this.config.fieldSize }, (_, idx) => idx + 1);
    }

    // eslint-disable-next-line max-statements
    identify(field: FieldInterface, cell: CellInterface, value: number): SolutionTechniqueEnum {
        const candidates = this.getCellCandidates(field, cell);

        if (candidates.length === 1 && candidates[0] === value) {
            return SolutionTechniqueEnum.NakedSingle;
        }

        if (this.isHiddenSingle(field, cell, value)) {
            return SolutionTechniqueEnum.HiddenSingle;
        }

        if (this.isNakedPair(field, cell, value)) {
            return SolutionTechniqueEnum.NakedPair;
        }

        if (this.isNakedTriple(field, cell, value)) {
            return SolutionTechniqueEnum.NakedTriple;
        }

        if (this.isNakedQuad(field, cell, value)) {
            return SolutionTechniqueEnum.NakedQuad;
        }

        if (this.isPointingPair(field, cell, value)) {
            return SolutionTechniqueEnum.PointingPair;
        }

        if (this.isBoxLineReduction(field, cell, value)) {
            return SolutionTechniqueEnum.BoxLineReduction;
        }

        if (this.isXWing(field, cell, value)) {
            return SolutionTechniqueEnum.XWing;
        }

        return SolutionTechniqueEnum.Guess;
    }

    findNakedSingles(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const row of field) {
            for (const cell of row) {
                if (cell.value === this.config.blankCellValue) {
                    const candidates = this.getCellCandidates(field, cell);
                    if (candidates.length === 1) {
                        results.push({ technique: SolutionTechniqueEnum.NakedSingle, cell, value: candidates[0] });
                    }
                }
            }
        }

        return results;
    }

    findHiddenSingles(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const row of field) {
            for (const cell of row) {
                if (cell.value === this.config.blankCellValue) {
                    this.findHiddenSinglesForCell(field, cell, results);
                }
            }
        }

        return results;
    }

    findNakedPairs(field: FieldInterface): TechniqueResultInterface[] {
        return this.findNakedSets(field, 2, SolutionTechniqueEnum.NakedPair);
    }

    findNakedTriples(field: FieldInterface): TechniqueResultInterface[] {
        return this.findNakedSets(field, 3, SolutionTechniqueEnum.NakedTriple);
    }

    findNakedQuads(field: FieldInterface): TechniqueResultInterface[] {
        return this.findNakedSets(field, 4, SolutionTechniqueEnum.NakedQuad);
    }

    getCellCandidates(field: FieldInterface, cell: CellInterface): number[] {
        const candidates: number[] = [];
        for (const val of this.fieldFillingValues) {
            const candidateCell = { ...cell, value: val };
            if (!this.hasValueInUnit(field, candidateCell)) {
                candidates.push(val);
            }
        }

        return candidates;
    }

    private findHiddenSinglesForCell(field: FieldInterface, cell: CellInterface, results: TechniqueResultInterface[]): void {
        const candidates = this.getCellCandidates(field, cell);
        for (const val of candidates) {
            if (this.isHiddenSingle(field, cell, val)) {
                results.push({ technique: SolutionTechniqueEnum.HiddenSingle, cell, value: val });
            }
        }
    }

    private isHiddenSingle(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isOnlyPlaceInRow(field, cell, value) || this.isOnlyPlaceInColumn(field, cell, value) || this.isOnlyPlaceInGroup(field, cell, value);
    }

    private isOnlyPlaceInRow(field: FieldInterface, cell: CellInterface, value: number): boolean {
        for (let xx = 0; xx < this.config.fieldSize; xx += 1) {
            if (xx !== cell.x && field[cell.y][xx].value === this.config.blankCellValue) {
                const otherCandidates = this.getCellCandidates(field, field[cell.y][xx]);
                if (otherCandidates.includes(value)) {
                    return false;
                }
            }
        }

        return true;
    }

    private isOnlyPlaceInColumn(field: FieldInterface, cell: CellInterface, value: number): boolean {
        for (let yy = 0; yy < this.config.fieldSize; yy += 1) {
            if (yy !== cell.y && field[yy][cell.x].value === this.config.blankCellValue) {
                const otherCandidates = this.getCellCandidates(field, field[yy][cell.x]);
                if (otherCandidates.includes(value)) {
                    return false;
                }
            }
        }

        return true;
    }

    private isOnlyPlaceInGroup(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);

        for (let dy = 0; dy < this.config.fieldGroupHeight; dy += 1) {
            for (let dx = 0; dx < this.config.fieldGroupWidth; dx += 1) {
                const yy = boxStartY + dy;
                const xx = boxStartX + dx;
                if ((yy !== cell.y || xx !== cell.x) && field[yy][xx].value === this.config.blankCellValue) {
                    const otherCandidates = this.getCellCandidates(field, field[yy][xx]);
                    if (otherCandidates.includes(value)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    private isNakedPair(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isNakedSet(field, cell, value, 2);
    }

    private isNakedTriple(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isNakedSet(field, cell, value, 3);
    }

    private isNakedQuad(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isNakedSet(field, cell, value, 4);
    }

    private isNakedSet(field: FieldInterface, cell: CellInterface, value: number, setSize: number): boolean {
        const cellCandidates = this.getCellCandidates(field, cell);
        if (cellCandidates.length !== setSize || !cellCandidates.includes(value)) {
            return false;
        }

        return this.hasNakedSetInUnit(field, cell, cellCandidates, setSize);
    }

    private hasNakedSetInUnit(field: FieldInterface, cell: CellInterface, targets: number[], setSize: number): boolean {
        const rowCount = this.countNakedSetInRow(field, cell, targets, setSize);
        const colCount = this.countNakedSetInColumn(field, cell, targets, setSize);
        const boxCount = this.countNakedSetInBox(field, cell, targets, setSize);

        return rowCount === setSize || colCount === setSize || boxCount === setSize;
    }

    private countNakedSetInRow(field: FieldInterface, cell: CellInterface, targets: number[], setSize: number): number {
        let count = 0;
        for (let xx = 0; xx < this.config.fieldSize; xx += 1) {
            if (field[cell.y][xx].value === this.config.blankCellValue) {
                const cands = this.getCellCandidates(field, field[cell.y][xx]);
                if (cands.length <= setSize && cands.every(cc => targets.includes(cc))) {
                    count += 1;
                }
            }
        }

        return count;
    }

    private countNakedSetInColumn(field: FieldInterface, cell: CellInterface, targets: number[], setSize: number): number {
        let count = 0;
        for (let yy = 0; yy < this.config.fieldSize; yy += 1) {
            if (field[yy][cell.x].value === this.config.blankCellValue) {
                const cands = this.getCellCandidates(field, field[yy][cell.x]);
                if (cands.length <= setSize && cands.every(cc => targets.includes(cc))) {
                    count += 1;
                }
            }
        }

        return count;
    }

    private countNakedSetInBox(field: FieldInterface, cell: CellInterface, targets: number[], setSize: number): number {
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);
        let count = 0;

        for (let dy = 0; dy < this.config.fieldGroupHeight; dy += 1) {
            for (let dx = 0; dx < this.config.fieldGroupWidth; dx += 1) {
                const yy = boxStartY + dy;
                const xx = boxStartX + dx;
                if (field[yy][xx].value === this.config.blankCellValue) {
                    const cands = this.getCellCandidates(field, field[yy][xx]);
                    if (cands.length <= setSize && cands.every(cc => targets.includes(cc))) {
                        count += 1;
                    }
                }
            }
        }

        return count;
    }

    private isPointingPair(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);
        const cellsWithValue = this.getCellsWithValueInBox(field, boxStartY, boxStartX, value);

        if (cellsWithValue.length < 2 || cellsWithValue.length > 3) {
            return false;
        }

        const allSameRow = cellsWithValue.every(cc => cc.y === cellsWithValue[0].y);
        const allSameCol = cellsWithValue.every(cc => cc.x === cellsWithValue[0].x);

        if (allSameRow) {
            return this.hasEliminationInRow(field, cellsWithValue[0].y, boxStartX, value);
        }
        if (allSameCol) {
            return this.hasEliminationInColumn(field, cellsWithValue[0].x, boxStartY, value);
        }

        return false;
    }

    private getCellsWithValueInBox(field: FieldInterface, boxStartY: number, boxStartX: number, value: number): CellInterface[] {
        const cells: CellInterface[] = [];

        for (let dy = 0; dy < this.config.fieldGroupHeight; dy += 1) {
            for (let dx = 0; dx < this.config.fieldGroupWidth; dx += 1) {
                const yy = boxStartY + dy;
                const xx = boxStartX + dx;
                if (field[yy][xx].value === this.config.blankCellValue) {
                    const cands = this.getCellCandidates(field, field[yy][xx]);
                    if (cands.includes(value)) {
                        cells.push(field[yy][xx]);
                    }
                }
            }
        }

        return cells;
    }

    private hasEliminationInRow(field: FieldInterface, row: number, boxStartX: number, value: number): boolean {
        for (let xx = 0; xx < this.config.fieldSize; xx += 1) {
            if (xx < boxStartX || xx >= boxStartX + this.config.fieldGroupWidth) {
                if (field[row][xx].value === this.config.blankCellValue) {
                    const cands = this.getCellCandidates(field, field[row][xx]);
                    if (cands.includes(value)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private hasEliminationInColumn(field: FieldInterface, col: number, boxStartY: number, value: number): boolean {
        for (let yy = 0; yy < this.config.fieldSize; yy += 1) {
            if (yy < boxStartY || yy >= boxStartY + this.config.fieldGroupHeight) {
                if (field[yy][col].value === this.config.blankCellValue) {
                    const cands = this.getCellCandidates(field, field[yy][col]);
                    if (cands.includes(value)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private isBoxLineReduction(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.checkBoxLineInRow(field, cell, value) || this.checkBoxLineInColumn(field, cell, value);
    }

    private checkBoxLineInRow(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const cellsInRow = this.getCellsWithValueInRow(field, cell.y, value);
        if (cellsInRow.length < 2 || cellsInRow.length > 3) {
            return false;
        }

        const firstBoxX = Math.floor(cellsInRow[0].x / this.config.fieldGroupWidth);
        const allSameBox = cellsInRow.every(cc => Math.floor(cc.x / this.config.fieldGroupWidth) === firstBoxX);

        return allSameBox;
    }

    private checkBoxLineInColumn(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const cellsInCol = this.getCellsWithValueInColumn(field, cell.x, value);
        if (cellsInCol.length < 2 || cellsInCol.length > 3) {
            return false;
        }

        const firstBoxY = Math.floor(cellsInCol[0].y / this.config.fieldGroupHeight);
        const allSameBox = cellsInCol.every(cc => Math.floor(cc.y / this.config.fieldGroupHeight) === firstBoxY);

        return allSameBox;
    }

    private getCellsWithValueInRow(field: FieldInterface, row: number, value: number): CellInterface[] {
        const cells: CellInterface[] = [];
        for (let xx = 0; xx < this.config.fieldSize; xx += 1) {
            if (field[row][xx].value === this.config.blankCellValue) {
                const cands = this.getCellCandidates(field, field[row][xx]);
                if (cands.includes(value)) {
                    cells.push(field[row][xx]);
                }
            }
        }

        return cells;
    }

    private getCellsWithValueInColumn(field: FieldInterface, col: number, value: number): CellInterface[] {
        const cells: CellInterface[] = [];
        for (let yy = 0; yy < this.config.fieldSize; yy += 1) {
            if (field[yy][col].value === this.config.blankCellValue) {
                const cands = this.getCellCandidates(field, field[yy][col]);
                if (cands.includes(value)) {
                    cells.push(field[yy][col]);
                }
            }
        }

        return cells;
    }

    private isXWing(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const rowPositions = this.getRowPositionsForValue(field, value);
        if (rowPositions.size < 2) {
            return false;
        }

        const rows = Array.from(rowPositions.keys());
        for (let ii = 0; ii < rows.length; ii += 1) {
            for (let jj = ii + 1; jj < rows.length; jj += 1) {
                const pos1 = rowPositions.get(rows[ii]) ?? [];
                const pos2 = rowPositions.get(rows[jj]) ?? [];
                if (pos1.length === 2 && pos2.length === 2 && pos1[0] === pos2[0] && pos1[1] === pos2[1]) {
                    if ((cell.y === rows[ii] || cell.y === rows[jj]) && (cell.x === pos1[0] || cell.x === pos1[1])) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private getRowPositionsForValue(field: FieldInterface, value: number): Map<number, number[]> {
        const rowPositions: Map<number, number[]> = new Map();

        for (let yy = 0; yy < this.config.fieldSize; yy += 1) {
            const positions: number[] = [];
            for (let xx = 0; xx < this.config.fieldSize; xx += 1) {
                if (field[yy][xx].value === this.config.blankCellValue) {
                    const cands = this.getCellCandidates(field, field[yy][xx]);
                    if (cands.includes(value)) {
                        positions.push(xx);
                    }
                }
            }
            if (positions.length === 2) {
                rowPositions.set(yy, positions);
            }
        }

        return rowPositions;
    }

    private findNakedSets(field: FieldInterface, setSize: number, technique: SolutionTechniqueEnum): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const row of field) {
            for (const cell of row) {
                if (cell.value === this.config.blankCellValue) {
                    const candidates = this.getCellCandidates(field, cell);
                    if (candidates.length === setSize && this.hasNakedSetInUnit(field, cell, candidates, setSize)) {
                        this.addCandidatesToResults(cell, candidates, technique, results);
                    }
                }
            }
        }

        return results;
    }

    private addCandidatesToResults(
        cell: CellInterface,
        candidates: number[],
        technique: SolutionTechniqueEnum,
        results: TechniqueResultInterface[]
    ): void {
        for (const val of candidates) {
            results.push({ technique, cell, value: val });
        }
    }

    private hasValueInUnit(field: FieldInterface, cell: CellInterface): boolean {
        return this.hasValueInRow(field, cell) || this.hasValueInColumn(field, cell) || this.hasValueInGroup(field, cell);
    }

    private hasValueInRow(field: FieldInterface, cell: CellInterface): boolean {
        for (let xx = 0; xx < this.config.fieldSize; xx += 1) {
            if (field[cell.y][xx].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    private hasValueInColumn(field: FieldInterface, cell: CellInterface): boolean {
        for (const row of field) {
            if (row[cell.x].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    private hasValueInGroup(field: FieldInterface, cell: CellInterface): boolean {
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);

        for (let yy = 0; yy < this.config.fieldGroupHeight; yy += 1) {
            for (let xx = 0; xx < this.config.fieldGroupWidth; xx += 1) {
                if (field[yy + boxStartY][xx + boxStartX].value === cell.value) {
                    return true;
                }
            }
        }

        return false;
    }
}
