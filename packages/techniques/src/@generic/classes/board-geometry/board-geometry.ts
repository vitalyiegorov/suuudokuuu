import { isDefined } from '@rnw-community/shared';

import type { BoardUnitDescriptorInterface } from '../../interfaces/board-unit-descriptor.interface';
import type { CellInterface, FieldInterface, SudokuConfigInterface } from '@suuudokuuu/generator';

const emptyCellIndexes: readonly number[] = Object.freeze([]);

const geometriesByConfig = new WeakMap<SudokuConfigInterface, BoardGeometry>();
const geometriesByLayoutKey = new Map<string, BoardGeometry>();

const getLayoutKey = (config: SudokuConfigInterface): string => `${config.fieldSize}:${config.fieldGroupWidth}:${config.fieldGroupHeight}`;

export class BoardGeometry {
    readonly cellCount: number;
    readonly values: readonly number[];
    readonly unitDescriptors: readonly BoardUnitDescriptorInterface[];

    private readonly fieldSize: number;
    private readonly groupByCellIndex: readonly number[];
    private readonly rowCellIndexes: readonly (readonly number[])[];
    private readonly columnCellIndexes: readonly (readonly number[])[];
    private readonly groupCellIndexesByGroup: ReadonlyMap<number, readonly number[]>;
    private readonly peerCellIndexes: readonly (readonly number[])[];

    constructor(config: SudokuConfigInterface, field: FieldInterface) {
        this.fieldSize = config.fieldSize;
        this.cellCount = this.fieldSize * this.fieldSize;
        this.values = Array.from({ length: this.fieldSize }, (_, index) => index + 1);
        this.groupByCellIndex = this.createGroupByCellIndex(field);
        this.rowCellIndexes = this.createRowCellIndexes();
        this.columnCellIndexes = this.createColumnCellIndexes();
        this.groupCellIndexesByGroup = this.createGroupCellIndexesByGroup();
        this.unitDescriptors = this.createUnitDescriptors();
        this.peerCellIndexes = this.createPeerCellIndexes();
    }

    getCellIndex(cell: Pick<CellInterface, 'x' | 'y'>): number {
        const isInsideBoard = cell.x >= 0 && cell.x < this.fieldSize && cell.y >= 0 && cell.y < this.fieldSize;

        return isInsideBoard ? cell.y * this.fieldSize + cell.x : -1;
    }

    getColumnCellIndexes(columnIndex: number): readonly number[] {
        return this.columnCellIndexes[columnIndex];
    }

    getGroupCellIndexes(groupIndex: number): readonly number[] {
        return this.groupCellIndexesByGroup.get(groupIndex) ?? emptyCellIndexes;
    }

    getPeerCellIndexes(cellIndex: number): readonly number[] {
        const peerCellIndexes = this.peerCellIndexes[cellIndex];

        return isDefined(peerCellIndexes) ? peerCellIndexes : emptyCellIndexes;
    }

    private createGroupByCellIndex(field: FieldInterface): readonly number[] {
        const groupByCellIndex: number[] = [];

        for (const row of field) {
            for (const cell of row) {
                groupByCellIndex[this.getCellIndex(cell)] = cell.group;
            }
        }

        return groupByCellIndex;
    }

    private createRowCellIndexes(): readonly (readonly number[])[] {
        return Array.from({ length: this.fieldSize }, (_, rowIndex) =>
            Array.from({ length: this.fieldSize }, (__, columnIndex) => rowIndex * this.fieldSize + columnIndex)
        );
    }

    private createColumnCellIndexes(): readonly (readonly number[])[] {
        return Array.from({ length: this.fieldSize }, (_, columnIndex) =>
            Array.from({ length: this.fieldSize }, (__, rowIndex) => rowIndex * this.fieldSize + columnIndex)
        );
    }

    private createGroupCellIndexesByGroup(): ReadonlyMap<number, readonly number[]> {
        const groupCellIndexesByGroup = new Map<number, number[]>();

        for (let cellIndex = 0; cellIndex < this.cellCount; cellIndex += 1) {
            const groupIndex = this.groupByCellIndex[cellIndex];
            const cellIndexes = groupCellIndexesByGroup.get(groupIndex);

            if (isDefined(cellIndexes)) {
                cellIndexes.push(cellIndex);
            } else {
                groupCellIndexesByGroup.set(groupIndex, [cellIndex]);
            }
        }

        return groupCellIndexesByGroup;
    }

    private createUnitDescriptors(): readonly BoardUnitDescriptorInterface[] {
        const unitDescriptors: BoardUnitDescriptorInterface[] = [];

        for (let index = 0; index < this.fieldSize; index += 1) {
            unitDescriptors.push({ type: 'row', index, cellIndexes: this.rowCellIndexes[index] });
            unitDescriptors.push({ type: 'column', index, cellIndexes: this.columnCellIndexes[index] });
        }

        const sortedGroupIndexes = [...this.groupCellIndexesByGroup.keys()].sort(
            (firstGroupIndex, secondGroupIndex) => firstGroupIndex - secondGroupIndex
        );

        for (const groupIndex of sortedGroupIndexes) {
            unitDescriptors.push({ type: 'group', index: groupIndex, cellIndexes: this.getGroupCellIndexes(groupIndex) });
        }

        return unitDescriptors;
    }

    private createPeerCellIndexes(): readonly (readonly number[])[] {
        const peerCellIndexes: number[][] = [];

        for (let cellIndex = 0; cellIndex < this.cellCount; cellIndex += 1) {
            const rowIndex = Math.floor(cellIndex / this.fieldSize);
            const columnIndex = cellIndex % this.fieldSize;
            const candidatePeerIndexes = [
                ...this.rowCellIndexes[rowIndex],
                ...this.columnCellIndexes[columnIndex],
                ...this.getGroupCellIndexes(this.groupByCellIndex[cellIndex])
            ];
            const seenCellIndexes = new Set<number>();
            const peers: number[] = [];

            for (const peerCellIndex of candidatePeerIndexes) {
                if (peerCellIndex !== cellIndex && !seenCellIndexes.has(peerCellIndex)) {
                    seenCellIndexes.add(peerCellIndex);
                    peers.push(peerCellIndex);
                }
            }

            peerCellIndexes.push(peers);
        }

        return peerCellIndexes;
    }

    static forBoard(config: SudokuConfigInterface, field: FieldInterface): BoardGeometry {
        const cachedGeometry = geometriesByConfig.get(config);

        if (isDefined(cachedGeometry)) {
            return cachedGeometry;
        }

        const layoutKey = getLayoutKey(config);
        const layoutGeometry = geometriesByLayoutKey.get(layoutKey) ?? new BoardGeometry(config, field);

        geometriesByLayoutKey.set(layoutKey, layoutGeometry);
        geometriesByConfig.set(config, layoutGeometry);

        return layoutGeometry;
    }
}
