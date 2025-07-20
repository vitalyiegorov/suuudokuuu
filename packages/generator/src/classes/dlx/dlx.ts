import { isDefined } from '@rnw-community/shared';

import { ColumnNode } from './column-node';
import { DLXNode } from './dlx-node';

import type { RowMappingInterface } from '../../interfaces/row-mapping.interface';
import type { SudokuGridType } from '../../types/sudoku-grid.type';

export class DLXSolver {
    private header: ColumnNode;
    private solution: DLXNode[];
    private rowMapping: RowMappingInterface[];

    constructor() {
        this.header = new ColumnNode('header');
        this.header.left = this.header;
        this.header.right = this.header;
        this.solution = [];
        this.rowMapping = [];
    }

    public solve(grid: SudokuGridType): SudokuGridType | null {
        this.header = new ColumnNode('header');
        this.header.left = this.header;
        this.header.right = this.header;
        this.solution = [];
        this.rowMapping = [];

        this.buildExactCover(grid);

        return this.search(0) ? this.buildResult() : null;
    }

    // eslint-disable-next-line max-statements
    private buildExactCover(grid: SudokuGridType): void {
        const cellCount = 81;
        const constraintsCount = 4;
        const columnCountWithConstraints = cellCount * constraintsCount;

        const columns: ColumnNode[] = [];
        for (let i = 0; i < columnCountWithConstraints; i += 1) {
            const col = new ColumnNode(i.toString());
            columns.push(col);

            col.right = this.header;
            col.left = this.header.left;

            this.header.left.right = col;
            this.header.left = col;
        }

        for (let row = 0; row < 9; row += 1) {
            for (let col = 0; col < 9; col += 1) {
                for (let num = 1; num <= 9; num += 1) {
                    const isNumberConflicting = grid[row][col] !== 0 && grid[row][col] !== num;
                    if (isNumberConflicting) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }

                    const mapIndex = this.rowMapping.length;
                    this.rowMapping.push({ row, col, num });

                    const cellCon = row * 9 + col;
                    const rowCon = cellCount + row * 9 + (num - 1);
                    const colCon = 2 * cellCount + col * 9 + (num - 1);
                    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
                    const boxCon = 3 * cellCount + box * 9 + (num - 1);

                    const rowNodes: DLXNode[] = [];
                    for (const colIndex of [cellCon, rowCon, colCon, boxCon]) {
                        const colNode = columns[colIndex];
                        const node = new DLXNode();
                        node.column = colNode;
                        node.rowIndex = mapIndex;

                        // Link vertically
                        node.down = colNode;
                        node.up = colNode.up;
                        colNode.up.down = node;
                        colNode.up = node;
                        colNode.size += 1;

                        rowNodes.push(node);
                    }

                    // Link horizontally
                    for (let i = 0; i < rowNodes.length; i += 1) {
                        rowNodes[i].right = rowNodes[(i + 1) % rowNodes.length];
                        rowNodes[i].left = rowNodes[(i + rowNodes.length - 1) % rowNodes.length];
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    private cover(col: ColumnNode): void {
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

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    private uncover(col: ColumnNode): void {
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

    // eslint-disable-next-line max-statements
    private search(step: number): boolean {
        // HINT: If no columns left, a solution is found
        if (this.header.right === this.header) {
            return true;
        }

        // HINT: Choose column with smallest size (heuristic)
        let col = this.header.right as ColumnNode;
        for (let currentCol = col.right as ColumnNode; currentCol !== this.header; currentCol = currentCol.right as ColumnNode) {
            if (currentCol.size < col.size) {
                col = currentCol;
            }
        }

        this.cover(col);

        for (let row = col.down; row !== col; row = row.down) {
            this.solution[step] = row;
            for (let node = row.right; node !== row; node = node.right) {
                this.cover(node.column);
            }

            if (this.search(step + 1)) {
                return true;
            }

            for (let node = row.left; node !== row; node = node.left) {
                this.uncover(node.column);
            }
        }

        this.uncover(col);

        return false;
    }

    private buildResult(): SudokuGridType {
        const result: SudokuGridType = Array.from({ length: 9 }, () => Array<number>(9).fill(0));
        for (const node of this.solution) {
            if (isDefined(node.rowIndex)) {
                const { row, col, num } = this.rowMapping[node.rowIndex];

                result[row][col] = num;
            }
        }

        return result;
    }
}
