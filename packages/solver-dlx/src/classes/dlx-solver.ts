import { GRID_BLANK_VALUE, GRID_BOX_SIZE, GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';

import { isDefined } from '@rnw-community/shared';

import { DLXColumnNode } from './dlx-column-node';
import { DLXNode } from './dlx-node';

import type { RowMappingInterface } from '../interfaces/row-mapping.interface';
import type { SolverInterface } from '@suuudokuuu/solver-core';

export class DLXSolver implements SolverInterface {
    private header: DLXColumnNode = new DLXColumnNode('header');
    private solution: DLXNode[] = [];
    private rowMapping: RowMappingInterface[] = [];

    constructor() {
        this.reset();
    }

    solve(grid: Uint8Array): Uint8Array | null {
        this.reset();

        this.buildExactCover(grid);

        if (this.search(0, 1) > 0) {
            const result = new Uint8Array(GRID_CELL_COUNT);
            for (const rowIndex of this.solution.map(node => node.rowIndex).filter(isDefined)) {
                const { row, col, num } = this.rowMapping[rowIndex];

                result[row * GRID_SIZE + col] = num;
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
        this.header = new DLXColumnNode('header');
        this.header.left = this.header;
        this.header.right = this.header;

        this.solution = [];
        this.rowMapping = [];
    }

    // eslint-disable-next-line max-statements -- exact-cover matrix construction needs one pass building cell/row/column/box constraint columns and nodes
    private buildExactCover(grid: Uint8Array): void {
        const constraintsCount = 4;
        const columnCountWithConstraints = GRID_CELL_COUNT * constraintsCount;

        const columns: DLXColumnNode[] = [];
        for (let i = 0; i < columnCountWithConstraints; i += 1) {
            const col = new DLXColumnNode(i.toString());
            columns.push(col);

            col.right = this.header;
            col.left = this.header.left;

            this.header.left.right = col;
            this.header.left = col;
        }

        for (let row = 0; row < GRID_SIZE; row += 1) {
            for (let col = 0; col < GRID_SIZE; col += 1) {
                for (let num = 1; num <= GRID_SIZE; num += 1) {
                    const cellValue = grid[row * GRID_SIZE + col];
                    const isNumberConflicting = cellValue !== GRID_BLANK_VALUE && cellValue !== num;
                    if (isNumberConflicting) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    const mapIndex = this.rowMapping.length;
                    this.rowMapping.push({ row, col, num });

                    const cellCon = row * GRID_SIZE + col;
                    const rowCon = GRID_CELL_COUNT + row * GRID_SIZE + (num - 1);
                    const colCon = 2 * GRID_CELL_COUNT + col * GRID_SIZE + (num - 1);
                    const box = Math.floor(row / GRID_BOX_SIZE) * GRID_BOX_SIZE + Math.floor(col / GRID_BOX_SIZE);
                    const boxCon = 3 * GRID_CELL_COUNT + box * GRID_SIZE + (num - 1);

                    const rowNodes: DLXNode[] = [];
                    for (const colIndex of [cellCon, rowCon, colCon, boxCon]) {
                        const colNode = columns[colIndex];
                        const node = new DLXNode();
                        node.column = colNode;
                        node.rowIndex = mapIndex;

                        node.down = colNode;
                        node.up = colNode.up;
                        colNode.up.down = node;
                        colNode.up = node;
                        colNode.size += 1;

                        rowNodes.push(node);
                    }

                    for (let i = 0; i < rowNodes.length; i += 1) {
                        rowNodes[i].right = rowNodes[(i + 1) % rowNodes.length];
                        rowNodes[i].left = rowNodes[(i + rowNodes.length - 1) % rowNodes.length];
                    }
                }
            }
        }
    }

    private cover(col: DLXColumnNode): void {
        col.right.left = col.left;
        col.left.right = col.right;

        for (let row = col.down; row !== col; row = row.down) {
            for (let node = row.right; node !== row; node = node.right) {
                node.down.up = node.up;
                node.up.down = node.down;
                node.column.size -= 1;
            }
        }
    }

    private uncover(col: DLXColumnNode): void {
        for (let row = col.up; row !== col; row = row.up) {
            for (let node = row.left; node !== row; node = node.left) {
                node.down.up = node;
                node.up.down = node;
                node.column.size += 1;
            }
        }
        col.right.left = col;
        col.left.right = col;
    }

    // eslint-disable-next-line max-statements -- DLX search picks the smallest column, then covers/recurses/uncovers within one bounded backtracking step
    private search(step: number, limit: number): number {
        if (this.header.right === this.header) {
            return 1;
        }

        let col = this.header.right as DLXColumnNode;
        for (let current = col.right as DLXColumnNode; current !== this.header; current = current.right as DLXColumnNode) {
            if (current.size < col.size) {
                col = current;
            }
        }

        this.cover(col);

        let count = 0;

        for (let row = col.down; row !== col; row = row.down) {
            this.solution[step] = row;

            for (let node = row.right; node !== row; node = node.right) {
                this.cover(node.column);
            }

            const result = this.search(step + 1, limit - count);

            count += result;

            if (count >= limit && result > 0) {
                for (let node = row.left; node !== row; node = node.left) {
                    this.uncover(node.column);
                }
                this.uncover(col);

                return count;
            }

            for (let node = row.left; node !== row; node = node.left) {
                this.uncover(node.column);
            }
        }

        this.uncover(col);

        return count;
    }
}
