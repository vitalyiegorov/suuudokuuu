import type { ConnectedComponentInterface } from './connected-component.interface';

export interface ComponentLabelingInterface {
    readonly labels: Int32Array;
    readonly components: readonly ConnectedComponentInterface[];
}
