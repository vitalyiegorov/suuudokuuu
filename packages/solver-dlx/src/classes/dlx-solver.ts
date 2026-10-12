import { BOX_BY_CELL, COLUMN_BY_CELL, GRID_BLANK_VALUE, GRID_CELL_COUNT, GRID_SIZE, ROW_BY_CELL } from '@suuudokuuu/solver-core';

import { isDefined } from '@rnw-community/shared';

import { DLXColumnNode } from './dlx-column-node';
import { DLXNode } from './dlx-node';

import type { SolverInterface } from '@suuudokuuu/solver-core';

export class DLXSolver implements SolverInterface {
    private header: DLXColumnNode = new DLXColumnNode();
    private solution: DLXNode[] = [];

    solve(grid: Uint8Array): Uint8Array | null {
        this.reset();

        this.buildExactCover(grid);

        if (this.search(0, 1) > 0) {
            const result = new Uint8Array(GRID_CELL_COUNT);
            for (const rowIndex of this.solution.map(node => node.rowIndex).filter(isDefined)) {
                result[Math.floor(rowIndex / GRID_SIZE)] = (rowIndex % GRID_SIZE) + 1;
            }

            return result;
        }

        return null;
    }

    countSolutions(grid: Uint8Array, limit: number): number {
        this.reset();

        this.buildExactCover(grid);

        return this.search(0, limit);
    }

    private reset(): void {
        this.header = new DLXColumnNode();

        this.solution = [];
    }

    private buildExactCover(grid: Uint8Array): void {
        const constraintsCount = 4;
        const columns: DLXColumnNode[] = [];
        for (let columnIndex = 0; columnIndex < GRID_CELL_COUNT * constraintsCount; columnIndex += 1) {
            const column = new DLXColumnNode();
            columns.push(column);
            column.right = this.header;
            column.left = this.header.left;
            this.header.left.right = column;
            this.header.left = column;
        }

        for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
            for (let digit = 1; digit <= GRID_SIZE; digit += 1) {
                if (grid[cell] === GRID_BLANK_VALUE || grid[cell] === digit) {
                    this.buildRow(columns, cell, digit);
                }
            }
        }
    }

    private buildRow(columns: DLXColumnNode[], cell: number, digit: number): void {
        const rowNodes: DLXNode[] = [];
        const rowConstraint = GRID_CELL_COUNT + ROW_BY_CELL[cell] * GRID_SIZE + digit - 1;
        const columnConstraint = 2 * GRID_CELL_COUNT + COLUMN_BY_CELL[cell] * GRID_SIZE + digit - 1;
        const boxConstraint = 3 * GRID_CELL_COUNT + BOX_BY_CELL[cell] * GRID_SIZE + digit - 1;

        for (const columnIndex of [cell, rowConstraint, columnConstraint, boxConstraint]) {
            rowNodes.push(this.appendNode(columns[columnIndex], cell * GRID_SIZE + digit - 1));
        }

        for (let nodeIndex = 0; nodeIndex < rowNodes.length; nodeIndex += 1) {
            rowNodes[nodeIndex].right = rowNodes[(nodeIndex + 1) % rowNodes.length];
            rowNodes[nodeIndex].left = rowNodes[(nodeIndex + rowNodes.length - 1) % rowNodes.length];
        }
    }

    private appendNode(column: DLXColumnNode, rowIndex: number): DLXNode {
        const node = new DLXNode();
        node.column = column;
        node.rowIndex = rowIndex;
        node.down = column;
        node.up = column.up;
        column.up.down = node;
        column.up = node;
        column.size += 1;

        return node;
    }

    private cover(column: DLXColumnNode): void {
        column.right.left = column.left;
        column.left.right = column.right;

        for (let row = column.down; row !== column; row = row.down) {
            for (let node = row.right; node !== row; node = node.right) {
                node.down.up = node.up;
                node.up.down = node.down;
                node.column.size -= 1;
            }
        }
    }

    private uncover(column: DLXColumnNode): void {
        for (let row = column.up; row !== column; row = row.up) {
            for (let node = row.left; node !== row; node = node.left) {
                node.down.up = node;
                node.up.down = node;
                node.column.size += 1;
            }
        }
        column.right.left = column;
        column.left.right = column;
    }

    private search(step: number, limit: number): number {
        if (this.header.right === this.header) {
            return 1;
        }

        const column = this.chooseColumn();
        this.cover(column);

        let count = 0;

        for (let row = column.down; row !== column; row = row.down) {
            const result = this.searchRow(row, step, limit - count);
            count += result;

            if (count >= limit && result > 0) {
                this.uncover(column);

                return count;
            }
        }

        this.uncover(column);

        return count;
    }
    private chooseColumn(): DLXColumnNode {
        let { column } = this.header.right;
        for (let current = column.right.column; current !== this.header; current = current.right.column) {
            if (current.size < column.size) {
                column = current;
            }
        }

        return column;
    }

    private searchRow(row: DLXNode, step: number, limit: number): number {
        this.solution[step] = row;
        for (let node = row.right; node !== row; node = node.right) {
            this.cover(node.column);
        }

        const result = this.search(step + 1, limit);
        for (let node = row.left; node !== row; node = node.left) {
            this.uncover(node.column);
        }

        return result;
    }
}
