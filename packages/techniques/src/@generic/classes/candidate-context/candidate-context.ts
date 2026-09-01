import { isDefined, isEmptyArray, isNotEmptyArray } from '@rnw-community/shared';

import { BoardGeometry } from '../board-geometry/board-geometry';

import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { CandidateUnitInterface } from '../../interfaces/candidate-unit.interface';
import type { CandidateMapType } from '../../types/candidate-map.type';
import type { CellInterface, FieldInterface, Sudoku, SudokuConfigInterface } from '@suuudokuuu/generator';

const emptyCandidates: readonly number[] = Object.freeze([]);
const emptyCandidateMap: CandidateMapType = Object.freeze({});

export class CandidateContext {
    private readonly geometry: BoardGeometry;
    private readonly candidatesByCellIndex: readonly (readonly number[])[];

    private cachedCells: CellInterface[] | null = null;
    private cachedColumnCells: CellInterface[][] | null = null;
    private cachedGroupCells: Map<number, CellInterface[]> | null = null;
    private cachedUnits: CandidateUnitInterface[] | null = null;
    private cachedPeerCells: (CellInterface[] | null)[] | null = null;

    constructor(
        private readonly config: SudokuConfigInterface,
        private readonly field: FieldInterface,
        candidateMap: CandidateMapType = {},
        candidatesByCellIndex?: readonly (readonly number[])[]
    ) {
        this.geometry = BoardGeometry.forBoard(config, field);
        this.candidatesByCellIndex = isDefined(candidatesByCellIndex) ? candidatesByCellIndex : this.createCandidatesFromMap(candidateMap);
    }

    getCandidates(cell: CellInterface): readonly number[] {
        const cellIndex = this.geometry.getCellIndex(cell);

        return cellIndex < 0 ? emptyCandidates : this.candidatesByCellIndex[cellIndex];
    }

    withEliminations(eliminations: CandidateEliminationInterface[]): CandidateContext {
        const eliminatedValuesByCellIndex = new Map<number, number[]>();

        for (const elimination of eliminations) {
            const cellIndex = this.geometry.getCellIndex(elimination.cell);

            if (cellIndex >= 0) {
                const eliminatedValues = eliminatedValuesByCellIndex.get(cellIndex);

                if (isDefined(eliminatedValues)) {
                    eliminatedValues.push(elimination.value);
                } else {
                    eliminatedValuesByCellIndex.set(cellIndex, [elimination.value]);
                }
            }
        }

        const nextCandidatesByCellIndex = [...this.candidatesByCellIndex];

        for (const [cellIndex, eliminatedValues] of eliminatedValuesByCellIndex) {
            const cellCandidates = this.candidatesByCellIndex[cellIndex];
            const remainingCandidates = cellCandidates.filter(candidate => !eliminatedValues.includes(candidate));

            nextCandidatesByCellIndex[cellIndex] =
                remainingCandidates.length === cellCandidates.length ? cellCandidates : Object.freeze(remainingCandidates);
        }

        return new CandidateContext(this.config, this.field, emptyCandidateMap, nextCandidatesByCellIndex);
    }

    withPlacement(cell: CellInterface, value: number): CandidateContext {
        const placedCellIndex = this.geometry.getCellIndex(cell);
        const nextCandidatesByCellIndex = [...this.candidatesByCellIndex];

        if (placedCellIndex >= 0) {
            nextCandidatesByCellIndex[placedCellIndex] = emptyCandidates;

            for (const peerCellIndex of this.geometry.getPeerCellIndexes(placedCellIndex)) {
                const peerCandidates = this.candidatesByCellIndex[peerCellIndex];

                if (peerCandidates.includes(value)) {
                    nextCandidatesByCellIndex[peerCellIndex] = Object.freeze(peerCandidates.filter(candidate => candidate !== value));
                }
            }
        }

        return new CandidateContext(this.config, this.createFieldWithValue(cell, value), emptyCandidateMap, nextCandidatesByCellIndex);
    }

    isBlankCell(cell: CellInterface): boolean {
        return cell.value === this.config.blankCellValue;
    }

    hasContradiction(): boolean {
        return this.getCachedCells().some(cell => this.isBlankCell(cell) && isEmptyArray(this.getCandidates(cell)));
    }

    isSolved(): boolean {
        return this.getCachedCells().every(cell => !this.isBlankCell(cell));
    }

    getCells(): CellInterface[] {
        return [...this.getCachedCells()];
    }

    getBlankCells(): CellInterface[] {
        return this.getCachedCells().filter(cell => isNotEmptyArray(this.getCandidates(cell)));
    }

    getValues(): number[] {
        return [...this.geometry.values];
    }

    getRowCells(rowIndex: number): CellInterface[] {
        return [...this.field[rowIndex]];
    }

    getColumnCells(columnIndex: number): CellInterface[] {
        return [...this.getCachedColumnCells()[columnIndex]];
    }

    getGroupCells(cell: Pick<CellInterface, 'group'>): CellInterface[] {
        const groupCells = this.getCachedGroupCells().get(cell.group);

        return isDefined(groupCells) ? [...groupCells] : [];
    }

    getUnits(): CandidateUnitInterface[] {
        return this.getCachedUnits().map(unit => ({ ...unit, cells: [...unit.cells] }));
    }

    getPeers(cell: CellInterface): CellInterface[] {
        const cellIndex = this.geometry.getCellIndex(cell);

        return cellIndex < 0 ? [] : [...this.getCachedCellPeers(cellIndex)];
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

    private createCandidatesFromMap(candidateMap: CandidateMapType): readonly (readonly number[])[] {
        const candidatesByCellIndex: (readonly number[])[] = [];

        for (let cellIndex = 0; cellIndex < this.geometry.cellCount; cellIndex += 1) {
            candidatesByCellIndex.push(emptyCandidates);
        }

        for (const row of this.field) {
            for (const cell of row) {
                const candidates = candidateMap[CandidateContext.getCellKey(cell)];

                if (isDefined(candidates)) {
                    candidatesByCellIndex[this.geometry.getCellIndex(cell)] = Object.freeze([...candidates]);
                }
            }
        }

        return candidatesByCellIndex;
    }

    private getCachedCells(): CellInterface[] {
        this.cachedCells ??= this.field.flatMap(row => row);

        return this.cachedCells;
    }

    private getCachedColumnCells(): CellInterface[][] {
        this.cachedColumnCells ??= Array.from({ length: this.config.fieldSize }, (_, columnIndex) =>
            this.geometry.getColumnCellIndexes(columnIndex).map(cellIndex => this.getCachedCells()[cellIndex])
        );

        return this.cachedColumnCells;
    }

    private getCachedGroupCells(): Map<number, CellInterface[]> {
        if (isDefined(this.cachedGroupCells)) {
            return this.cachedGroupCells;
        }

        const cells = this.getCachedCells();
        const groupCells = new Map<number, CellInterface[]>();

        for (const unitDescriptor of this.geometry.unitDescriptors) {
            if (unitDescriptor.type === 'group') {
                groupCells.set(
                    unitDescriptor.index,
                    unitDescriptor.cellIndexes.map(cellIndex => cells[cellIndex])
                );
            }
        }

        this.cachedGroupCells = groupCells;

        return groupCells;
    }

    private getCachedUnits(): CandidateUnitInterface[] {
        if (isDefined(this.cachedUnits)) {
            return this.cachedUnits;
        }

        const cells = this.getCachedCells();
        const units = this.geometry.unitDescriptors.map(unitDescriptor => ({
            type: unitDescriptor.type,
            index: unitDescriptor.index,
            cells: unitDescriptor.cellIndexes.map(cellIndex => cells[cellIndex])
        }));

        this.cachedUnits = units;

        return units;
    }

    private getCachedCellPeers(cellIndex: number): CellInterface[] {
        this.cachedPeerCells ??= Array.from({ length: this.geometry.cellCount }, () => null);

        const cachedCellPeers = this.cachedPeerCells[cellIndex];

        if (isDefined(cachedCellPeers)) {
            return cachedCellPeers;
        }

        const cells = this.getCachedCells();
        const peerCells = this.geometry.getPeerCellIndexes(cellIndex).map(peerCellIndex => cells[peerCellIndex]);

        this.cachedPeerCells[cellIndex] = peerCells;

        return peerCells;
    }

    private createFieldWithValue(cell: CellInterface, value: number): FieldInterface {
        return this.field.map(row => row.map(fieldCell => (this.isSameCell(fieldCell, cell) ? { ...fieldCell, value } : fieldCell)));
    }

    private isSameCell(cell: CellInterface, otherCell: CellInterface): boolean {
        return cell.x === otherCell.x && cell.y === otherCell.y;
    }

    static fromSudoku(sudoku: Sudoku): CandidateContext {
        const geometry = BoardGeometry.forBoard(sudoku.Config, sudoku.Field);
        const candidatesByCellIndex: (readonly number[])[] = [];

        for (let cellIndex = 0; cellIndex < geometry.cellCount; cellIndex += 1) {
            candidatesByCellIndex.push(emptyCandidates);
        }

        for (const row of sudoku.Field) {
            for (const cell of row) {
                if (sudoku.isBlankCell(cell)) {
                    candidatesByCellIndex[geometry.getCellIndex(cell)] = Object.freeze(sudoku.getCellCandidates(cell));
                }
            }
        }

        return new CandidateContext(sudoku.Config, sudoku.Field, emptyCandidateMap, candidatesByCellIndex);
    }

    static getCellKey(cell: CellInterface): string {
        return `${cell.y}:${cell.x}`;
    }
}
