import { DLXNode } from './dlx-node';

export class DLXColumnNode extends DLXNode {
    size = 0;

    constructor(public name: string) {
        super();

        this.column = this;
    }
}
