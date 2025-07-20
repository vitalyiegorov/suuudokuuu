import { DLXNode } from './dlx-node';

export class ColumnNode extends DLXNode {
    name: string;
    size = 0;

    constructor(name: string) {
        super();

        this.name = name;
        this.column = this;
    }
}
