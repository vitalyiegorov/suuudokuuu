import { DLXNode } from './dlx-node';

export class DLXColumnNode extends DLXNode {
    size = 0;

    constructor() {
        super();

        this.column = this;
    }
}
