import type { DLXColumnNode } from './dlx-column-node';

export class DLXNode {
    left: DLXNode;
    right: DLXNode;
    up: DLXNode;
    down: DLXNode;
    column!: DLXColumnNode;
    rowIndex?: number;

    constructor() {
        this.left = this;
        this.right = this;
        this.up = this;
        this.down = this;
    }
}
