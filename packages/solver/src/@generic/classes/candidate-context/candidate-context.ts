import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { CandidatePlacementInterface } from '../../interfaces/candidate-placement.interface';
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

    constructor(
        private readonly config: SudokuConfigInterface,
        private readonly field: FieldInterface,
        private readonly candidateMap: CandidateMapType = {}
    ) {
        this.cells = this.field.flatMap(row => row);
        this.values = Array.from({ length: this.config.fieldSize }, (_, index) => index + 1);
        this.rowCells = this.field.map(row => [...row]);
        this.columnCells = this.createColumnCells();
        this.groupCellsByIndex = this.createGroupCellsByIndex();
        this.units = this.createUnits();
        this.peersByCellKey = this.createPeersByCellKey();
    }

    getCandidateMap(): CandidateMapType {
        const candidateMap: CandidateMapType = {};

        for (const key of Object.keys(this.candidateMap)) {
            candidateMap[key] = [...this.candidateMap[key]];
        }

        return candidateMap;
    }

    getCandidates(cell: CellInterface): number[] {
        return this.candidateMap[CandidateContext.getCellKey(cell)] ?? [];
    }

    isBlankCell(cell: CellInterface): boolean {
        return cell.value === this.config.blankCellValue;
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

    applyEliminations(eliminations: CandidateEliminationInterface[]): CandidateContext {
        const candidateMap = this.getCandidateMap();

        for (const elimination of eliminations) {
            const key = CandidateContext.getCellKey(elimination.cell);
            const candidates = candidateMap[key] ?? [];

            candidateMap[key] = candidates.filter(candidate => candidate !== elimination.value);
        }

        return new CandidateContext(this.config, this.field, candidateMap);
    }

    getPlacementFromEliminations(eliminations: CandidateEliminationInterface[]): CandidatePlacementInterface | null {
        const placements = this.getPlacementsFromEliminations(eliminations);
        const [placement] = placements;

        return isDefined(placement) ? placement : null;
    }

    getPlacementsFromEliminations(eliminations: CandidateEliminationInterface[]): CandidatePlacementInterface[] {
        const nextContext = this.applyEliminations(eliminations);
        const seenCells: Record<string, boolean> = {};
        const placements: CandidatePlacementInterface[] = [];

        for (const elimination of eliminations) {
            const key = CandidateContext.getCellKey(elimination.cell);

            if (!seenCells[key]) {
                seenCells[key] = true;

                const candidates = nextContext.getCandidates(elimination.cell);
                const [value] = candidates;

                if (candidates.length === 1 && isDefined(value)) {
                    placements.push({ cell: elimination.cell, value });
                }
            }
        }

        return placements;
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
