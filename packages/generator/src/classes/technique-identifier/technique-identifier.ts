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

        if (this.isHiddenPair(field, cell, value)) {
            return SolutionTechniqueEnum.HiddenPair;
        }

        if (this.isNakedTriple(field, cell, value)) {
            return SolutionTechniqueEnum.NakedTriple;
        }

        if (this.isHiddenTriple(field, cell, value)) {
            return SolutionTechniqueEnum.HiddenTriple;
        }

        if (this.isNakedQuad(field, cell, value)) {
            return SolutionTechniqueEnum.NakedQuad;
        }

        if (this.isHiddenQuad(field, cell, value)) {
            return SolutionTechniqueEnum.HiddenQuad;
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

        if (this.isSwordfish(field, cell, value)) {
            return SolutionTechniqueEnum.Swordfish;
        }

        if (this.isJellyfish(field, cell, value)) {
            return SolutionTechniqueEnum.Jellyfish;
        }

        if (this.isXYWing(field, cell, value)) {
            return SolutionTechniqueEnum.XYWing;
        }

        if (this.isXYZWing(field, cell, value)) {
            return SolutionTechniqueEnum.XYZWing;
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

    findHiddenPairs(field: FieldInterface): TechniqueResultInterface[] {
        return this.findHiddenSets(field, 2, SolutionTechniqueEnum.HiddenPair);
    }

    findHiddenTriples(field: FieldInterface): TechniqueResultInterface[] {
        return this.findHiddenSets(field, 3, SolutionTechniqueEnum.HiddenTriple);
    }

    findHiddenQuads(field: FieldInterface): TechniqueResultInterface[] {
        return this.findHiddenSets(field, 4, SolutionTechniqueEnum.HiddenQuad);
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

    private isHiddenPair(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isHiddenSet(field, cell, value, 2);
    }

    private isHiddenTriple(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isHiddenSet(field, cell, value, 3);
    }

    private isHiddenQuad(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isHiddenSet(field, cell, value, 4);
    }

    private isHiddenSet(field: FieldInterface, cell: CellInterface, value: number, setSize: number): boolean {
        const cellCandidates = this.getCellCandidates(field, cell);
        if (!cellCandidates.includes(value)) {
            return false;
        }

        return (
            this.hasHiddenSetInRow(field, cell, value, setSize) ||
            this.hasHiddenSetInColumn(field, cell, value, setSize) ||
            this.hasHiddenSetInBox(field, cell, value, setSize)
        );
    }

    private hasHiddenSetInRow(field: FieldInterface, cell: CellInterface, value: number, setSize: number): boolean {
        const cellsMap = this.collectRowCandidates(field, cell.y);

        return this.checkHiddenSetPattern(cellsMap, value, setSize);
    }

    private collectRowCandidates(field: FieldInterface, row: number): Map<number, CellInterface[]> {
        const cellsMap = new Map<number, CellInterface[]>();

        for (let xx = 0; xx < this.config.fieldSize; xx += 1) {
            this.addRowCellCandidates(field, row, xx, cellsMap);
        }

        return cellsMap;
    }

    private addRowCellCandidates(field: FieldInterface, row: number, col: number, cellsMap: Map<number, CellInterface[]>): void {
        if (field[row][col].value !== this.config.blankCellValue) {
            return;
        }

        const cands = this.getCellCandidates(field, field[row][col]);
        for (const cand of cands) {
            if (!cellsMap.has(cand)) {
                cellsMap.set(cand, []);
            }
            cellsMap.get(cand)?.push(field[row][col]);
        }
    }

    private hasHiddenSetInColumn(field: FieldInterface, cell: CellInterface, value: number, setSize: number): boolean {
        const cellsMap = this.collectColumnCandidates(field, cell.x);

        return this.checkHiddenSetPattern(cellsMap, value, setSize);
    }

    private collectColumnCandidates(field: FieldInterface, col: number): Map<number, CellInterface[]> {
        const cellsMap = new Map<number, CellInterface[]>();

        for (let yy = 0; yy < this.config.fieldSize; yy += 1) {
            this.addColumnCellCandidates(field, yy, col, cellsMap);
        }

        return cellsMap;
    }

    private addColumnCellCandidates(field: FieldInterface, row: number, col: number, cellsMap: Map<number, CellInterface[]>): void {
        if (field[row][col].value !== this.config.blankCellValue) {
            return;
        }

        const cands = this.getCellCandidates(field, field[row][col]);
        for (const cand of cands) {
            if (!cellsMap.has(cand)) {
                cellsMap.set(cand, []);
            }
            cellsMap.get(cand)?.push(field[row][col]);
        }
    }

    private hasHiddenSetInBox(field: FieldInterface, cell: CellInterface, value: number, setSize: number): boolean {
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);
        const cellsMap = this.collectBoxCandidates(field, boxStartY, boxStartX);

        return this.checkHiddenSetPattern(cellsMap, value, setSize);
    }

    private collectBoxCandidates(field: FieldInterface, boxStartY: number, boxStartX: number): Map<number, CellInterface[]> {
        const cellsMap = new Map<number, CellInterface[]>();

        for (let dy = 0; dy < this.config.fieldGroupHeight; dy += 1) {
            for (let dx = 0; dx < this.config.fieldGroupWidth; dx += 1) {
                this.addBoxCellCandidates(field, boxStartY + dy, boxStartX + dx, cellsMap);
            }
        }

        return cellsMap;
    }

    private addBoxCellCandidates(field: FieldInterface, yy: number, xx: number, cellsMap: Map<number, CellInterface[]>): void {
        if (field[yy][xx].value !== this.config.blankCellValue) {
            return;
        }

        const cands = this.getCellCandidates(field, field[yy][xx]);
        for (const cand of cands) {
            if (!cellsMap.has(cand)) {
                cellsMap.set(cand, []);
            }
            cellsMap.get(cand)?.push(field[yy][xx]);
        }
    }

    private checkHiddenSetPattern(cellsMap: Map<number, CellInterface[]>, value: number, setSize: number): boolean {
        const valueCells = cellsMap.get(value);
        if (!valueCells || valueCells.length !== setSize) {
            return false;
        }

        const hiddenCandidates: number[] = [];
        for (const [cand, cells] of cellsMap.entries()) {
            if (cells.length === setSize && this.areSameCells(cells, valueCells)) {
                hiddenCandidates.push(cand);
            }
        }

        return hiddenCandidates.length === setSize;
    }

    private areSameCells(cells1: CellInterface[], cells2: CellInterface[]): boolean {
        if (cells1.length !== cells2.length) {
            return false;
        }

        const sorted1 = cells1.slice().sort((aa, bb) => (aa.y === bb.y ? aa.x - bb.x : aa.y - bb.y));
        const sorted2 = cells2.slice().sort((aa, bb) => (aa.y === bb.y ? aa.x - bb.x : aa.y - bb.y));

        return sorted1.every((cell, idx) => cell.x === sorted2[idx].x && cell.y === sorted2[idx].y);
    }

    private findHiddenSets(field: FieldInterface, setSize: number, technique: SolutionTechniqueEnum): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];
        const context = { field, setSize, technique, results };

        for (const row of field) {
            for (const cell of row) {
                this.addHiddenSetResults(cell, context);
            }
        }

        return results;
    }

    private addHiddenSetResults(cell: CellInterface, context: { field: FieldInterface; setSize: number; technique: SolutionTechniqueEnum; results: TechniqueResultInterface[] }): void {
        if (cell.value !== this.config.blankCellValue) {
            return;
        }

        const candidates = this.getCellCandidates(context.field, cell);
        for (const value of candidates) {
            if (this.isHiddenSet(context.field, cell, value, context.setSize)) {
                context.results.push({ technique: context.technique, cell, value });
            }
        }
    }

    private isSwordfish(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isFishPattern(field, cell, value, 3);
    }

    private isJellyfish(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return this.isFishPattern(field, cell, value, 4);
    }

    private isFishPattern(field: FieldInterface, cell: CellInterface, value: number, size: number): boolean {
        const rowPositions = this.getRowPositionsForFish(field, value, size);
        if (rowPositions.size < size) {
            return false;
        }

        const rows = Array.from(rowPositions.keys());
        for (let ii = 0; ii < rows.length - size + 1; ii += 1) {
            const combination = this.getCombination(rows, ii, size);
            if (this.checkFishCombination(rowPositions, combination, cell)) {
                return true;
            }
        }

        return false;
    }

    private getRowPositionsForFish(field: FieldInterface, value: number, maxSize: number): Map<number, number[]> {
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
            if (positions.length >= 2 && positions.length <= maxSize) {
                rowPositions.set(yy, positions);
            }
        }

        return rowPositions;
    }

    private getCombination(items: number[], start: number, size: number): number[] {
        const result: number[] = [];
        for (let ii = start; ii < start + size && ii < items.length; ii += 1) {
            result.push(items[ii]);
        }

        return result;
    }

    private checkFishCombination(rowPositions: Map<number, number[]>, rows: number[], cell: CellInterface): boolean {
        const allColumns = new Set<number>();
        for (const row of rows) {
            const positions = rowPositions.get(row);
            if (!positions) {
                return false;
            }
            for (const pos of positions) {
                allColumns.add(pos);
            }
        }

        if (allColumns.size !== rows.length) {
            return false;
        }

        return rows.includes(cell.y) && allColumns.has(cell.x);
    }

    private isXYWing(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const candidates = this.getCellCandidates(field, cell);
        if (candidates.length !== 2 || !candidates.includes(value)) {
            return false;
        }

        const [val1, val2] = candidates;
        const pincers = this.findXYWingPincers(field, cell, val1, val2);

        return pincers.length >= 2;
    }

    private findXYWingPincers(field: FieldInterface, pivot: CellInterface, val1: number, val2: number): CellInterface[] {
        const pincers: CellInterface[] = [];
        const values: [number, number] = [val1, val2];

        for (const row of field) {
            for (const cell of row) {
                if (this.isValidXYWingPincer(field, pivot, cell, values)) {
                    pincers.push(cell);
                }
            }
        }

        return pincers;
    }

    private isValidXYWingPincer(field: FieldInterface, pivot: CellInterface, cell: CellInterface, values: [number, number]): boolean {
        if (cell.value !== this.config.blankCellValue || (cell.x === pivot.x && cell.y === pivot.y)) {
            return false;
        }

        const cands = this.getCellCandidates(field, cell);
        if (cands.length !== 2) {
            return false;
        }

        const [val1, val2] = values;
        const hasValidPattern = (cands.includes(val1) && !cands.includes(val2)) || (cands.includes(val2) && !cands.includes(val1));

        return hasValidPattern && this.canSeeCell(pivot, cell);
    }

    private isXYZWing(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const candidates = this.getCellCandidates(field, cell);
        if (candidates.length !== 3 || !candidates.includes(value)) {
            return false;
        }

        const pincers = this.findXYZWingPincers(field, cell, candidates);

        return pincers.length >= 2;
    }

    private findXYZWingPincers(field: FieldInterface, pivot: CellInterface, pivotCandidates: number[]): CellInterface[] {
        const pincers: CellInterface[] = [];

        for (const row of field) {
            for (const cell of row) {
                if (this.isValidXYZWingPincer(field, pivot, cell, pivotCandidates)) {
                    pincers.push(cell);
                }
            }
        }

        return pincers;
    }

    private isValidXYZWingPincer(field: FieldInterface, pivot: CellInterface, cell: CellInterface, pivotCandidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || (cell.x === pivot.x && cell.y === pivot.y)) {
            return false;
        }

        const cands = this.getCellCandidates(field, cell);
        if (cands.length !== 2) {
            return false;
        }

        const sharedCount = cands.filter(cc => pivotCandidates.includes(cc)).length;

        return sharedCount === 2 && this.canSeeCell(pivot, cell);
    }

    private canSeeCell(cell1: CellInterface, cell2: CellInterface): boolean {
        if (cell1.y === cell2.y || cell1.x === cell2.x) {
            return true;
        }

        const box1Y = Math.floor(cell1.y / this.config.fieldGroupHeight);
        const box1X = Math.floor(cell1.x / this.config.fieldGroupWidth);
        const box2Y = Math.floor(cell2.y / this.config.fieldGroupHeight);
        const box2X = Math.floor(cell2.x / this.config.fieldGroupWidth);

        return box1Y === box2Y && box1X === box2X;
    }
}
