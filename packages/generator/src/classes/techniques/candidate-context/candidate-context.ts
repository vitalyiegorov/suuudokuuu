import { isDefined } from '@rnw-community/shared';

import type { CandidateEliminationInterface } from '../../../interfaces/candidate-elimination.interface';
import type { CandidatePlacementInterface } from '../../../interfaces/candidate-placement.interface';
import type { CandidateUnitInterface } from '../../../interfaces/candidate-unit.interface';
import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../../interfaces/sudoku-config.interface';
import type { CandidateMapType } from '../../../types/candidate-map.type';
import type { Sudoku } from '../../sudoku/sudoku';

export class CandidateContext {
    constructor(
        private readonly config: SudokuConfigInterface,
        private readonly field: FieldInterface,
        private readonly candidateMap: CandidateMapType = {}
    ) {}

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
        const cells: CellInterface[] = [];

        for (const row of this.field) {
            cells.push(...row);
        }

        return cells;
    }

    getBlankCells(): CellInterface[] {
        return this.getCells().filter(cell => this.getCandidates(cell).length > 0);
    }

    getValues(): number[] {
        return Array.from({ length: this.config.fieldSize }, (_, index) => index + 1);
    }

    getRowCells(rowIndex: number): CellInterface[] {
        return this.field[rowIndex];
    }

    getColumnCells(columnIndex: number): CellInterface[] {
        return this.field.map(row => row[columnIndex]);
    }

    getGroupCells(cell: Pick<CellInterface, 'group'>): CellInterface[] {
        return this.getCells().filter(currentCell => currentCell.group === cell.group);
    }

    getUnits(): CandidateUnitInterface[] {
        const units: CandidateUnitInterface[] = [];

        for (let index = 0; index < this.config.fieldSize; index += 1) {
            units.push({ type: 'row', index, cells: this.getRowCells(index) });
            units.push({ type: 'column', index, cells: this.getColumnCells(index) });
        }

        const groupIndexes = [...new Set(this.getCells().map(cell => cell.group))];

        for (const groupIndex of groupIndexes) {
            units.push({ type: 'group', index: groupIndex, cells: this.getGroupCells({ group: groupIndex }) });
        }

        return units;
    }

    getPeers(cell: CellInterface): CellInterface[] {
        const peerMap: Record<string, CellInterface> = {};

        for (const peer of [...this.getRowCells(cell.y), ...this.getColumnCells(cell.x), ...this.getGroupCells(cell)]) {
            if (!this.isSameCell(peer, cell)) {
                peerMap[CandidateContext.getCellKey(peer)] = peer;
            }
        }

        return Object.values(peerMap);
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
