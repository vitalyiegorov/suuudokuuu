import type { ColumnNode } from './column-node';

export class DLXNode {
    left: DLXNode;
    right: DLXNode;
    up: DLXNode;
    down: DLXNode;
    column!: ColumnNode;
    rowIndex?: number;

    constructor() {
        this.left = this;
        this.right = this;
        this.up = this;
        this.down = this;
    }
}
