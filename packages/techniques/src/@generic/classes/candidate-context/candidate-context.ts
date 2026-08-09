import { isDefined, isEmptyArray, isNotEmptyArray } from '@rnw-community/shared';

import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../interfaces/candidate-unit.interface';
import type { CandidateMapType } from '../../types/candidate-map.type';
import type { CellInterface, FieldInterface, Sudoku, SudokuConfigInterface } from '@suuudokuuu/generator';

export class CandidateContext {
    private readonly cells: CellInterface[];
    private readonly values: number[];
    private readonly rowCells: CellInterface[][];
    private readonly columnCells: CellInterface[][];
    private readonly groupCellsByIndex: Record<number, CellInterface[]>;
    private readonly units: CandidateUnitInterface[];
    private readonly peersByCellKey: Record<string, CellInterface[]>;
    private readonly candidateMap: CandidateMapType;

    constructor(
        private readonly config: SudokuConfigInterface,
        private readonly field: FieldInterface,
        candidateMap: CandidateMapType = {}
    ) {
        this.cells = this.field.flatMap(row => row);
        this.candidateMap = {};

        for (const cell of this.cells) {
            const key = CandidateContext.getCellKey(cell);
            const candidates = candidateMap[key];

            this.candidateMap[key] = Object.freeze(isDefined(candidates) ? [...candidates] : []);
        }

        this.values = Array.from({ length: this.config.fieldSize }, (_, index) => index + 1);
        this.rowCells = this.field.map(row => [...row]);
        this.columnCells = this.createColumnCells();
        this.groupCellsByIndex = this.createGroupCellsByIndex();
        this.units = this.createUnits();
        this.peersByCellKey = this.createPeersByCellKey();
    }

    getCandidates(cell: CellInterface): readonly number[] {
        return this.candidateMap[CandidateContext.getCellKey(cell)];
    }

    withEliminations(eliminations: CandidateEliminationInterface[]): CandidateContext {
        const eliminatedValuesByCellKey: Record<string, number[]> = {};

        for (const elimination of eliminations) {
            const key = CandidateContext.getCellKey(elimination.cell);

            eliminatedValuesByCellKey[key] = [...(eliminatedValuesByCellKey[key] ?? []), elimination.value];
        }

        const candidateMap: CandidateMapType = {};

        for (const cell of this.cells) {
            const key = CandidateContext.getCellKey(cell);
            const eliminatedValues = eliminatedValuesByCellKey[key] ?? [];

            candidateMap[key] = this.candidateMap[key].filter(candidate => !eliminatedValues.includes(candidate));
        }

        return new CandidateContext(this.config, this.field, candidateMap);
    }

    withPlacement(cell: CellInterface, value: number): CandidateContext {
        const placedCellKey = CandidateContext.getCellKey(cell);
        const peerKeys = new Set(this.getPeers(cell).map(peer => CandidateContext.getCellKey(peer)));
        const candidateMap: CandidateMapType = {};

        for (const fieldCell of this.cells) {
            const key = CandidateContext.getCellKey(fieldCell);

            if (key === placedCellKey) {
                candidateMap[key] = [];
            } else if (peerKeys.has(key)) {
                candidateMap[key] = this.candidateMap[key].filter(candidate => candidate !== value);
            } else {
                candidateMap[key] = this.candidateMap[key];
            }
        }

        return new CandidateContext(this.config, this.createFieldWithValue(cell, value), candidateMap);
    }

    isBlankCell(cell: CellInterface): boolean {
        return cell.value === this.config.blankCellValue;
    }

    hasContradiction(): boolean {
        return this.cells.some(cell => this.isBlankCell(cell) && isEmptyArray(this.getCandidates(cell)));
    }

    isSolved(): boolean {
        return this.cells.every(cell => !this.isBlankCell(cell));
    }

    getCells(): CellInterface[] {
        return [...this.cells];
    }

    getBlankCells(): CellInterface[] {
        return this.getCells().filter(cell => isNotEmptyArray(this.getCandidates(cell)));
    }

    getValues(): number[] {
        return [...this.values];
    }

    getRowCells(rowIndex: number): CellInterface[] {
        return [...this.rowCells[rowIndex]];
    }

    getColumnCells(columnIndex: number): CellInterface[] {
        return [...this.columnCells[columnIndex]];
    }

    getGroupCells(cell: Pick<CellInterface, 'group'>): CellInterface[] {
        return [...(this.groupCellsByIndex[cell.group] ?? [])];
    }

    getUnits(): CandidateUnitInterface[] {
        return this.units.map(unit => ({ ...unit, cells: [...unit.cells] }));
    }

    getPeers(cell: CellInterface): CellInterface[] {
        return [...(this.peersByCellKey[CandidateContext.getCellKey(cell)] ?? [])];
    }

    getCommonPeers(cells: CellInterface[]): CellInterface[] {
        const [firstCell] = cells;

        if (!isDefined(firstCell)) {
            return [];
        }

        const otherCells = cells.slice(1);

        return this.getPeers(firstCell).filter(peer =>
            otherCells.every(cell => this.getPeers(cell).some(otherPeer => this.isSameCell(peer, otherPeer)))
        );
    }

    private createFieldWithValue(cell: CellInterface, value: number): FieldInterface {
        return this.field.map(row => row.map(fieldCell => (this.isSameCell(fieldCell, cell) ? { ...fieldCell, value } : fieldCell)));
    }

    private createColumnCells(): CellInterface[][] {
        return Array.from({ length: this.config.fieldSize }, (_, columnIndex) => this.field.map(row => row[columnIndex]));
    }

    private createGroupCellsByIndex(): Record<number, CellInterface[]> {
        const groupCellsByIndex: Record<number, CellInterface[]> = {};

        for (const cell of this.cells) {
            const groupCells = groupCellsByIndex[cell.group] ?? [];

            groupCells.push(cell);
            groupCellsByIndex[cell.group] = groupCells;
        }

        return groupCellsByIndex;
    }

    private createUnits(): CandidateUnitInterface[] {
        const units: CandidateUnitInterface[] = [];

        for (let index = 0; index < this.config.fieldSize; index += 1) {
            units.push({ type: 'row', index, cells: this.rowCells[index] });
            units.push({ type: 'column', index, cells: this.columnCells[index] });
        }

        for (const groupIndex of Object.keys(this.groupCellsByIndex).map(Number)) {
            units.push({ type: 'group', index: groupIndex, cells: this.groupCellsByIndex[groupIndex] });
        }

        return units;
    }

    private createPeersByCellKey(): Record<string, CellInterface[]> {
        const peersByCellKey: Record<string, CellInterface[]> = {};

        for (const cell of this.cells) {
            const peerMap: Record<string, CellInterface> = {};

            for (const peer of [...this.rowCells[cell.y], ...this.columnCells[cell.x], ...this.getGroupCells(cell)]) {
                if (!this.isSameCell(peer, cell)) {
                    peerMap[CandidateContext.getCellKey(peer)] = peer;
                }
            }

            peersByCellKey[CandidateContext.getCellKey(cell)] = Object.values(peerMap);
        }

        return peersByCellKey;
    }

    private isSameCell(cell: CellInterface, otherCell: CellInterface): boolean {
        return cell.x === otherCell.x && cell.y === otherCell.y;
    }

    static fromSudoku(sudoku: Sudoku): CandidateContext {
        const candidateMap: CandidateMapType = {};

        for (const row of sudoku.Field) {
            for (const cell of row) {
                if (sudoku.isBlankCell(cell)) {
                    candidateMap[CandidateContext.getCellKey(cell)] = sudoku.getCellCandidates(cell);
                }
            }
        }

        return new CandidateContext(sudoku.Config, sudoku.Field, candidateMap);
    }

    static getCellKey(cell: CellInterface): string {
        return `${cell.y}:${cell.x}`;
    }
}
