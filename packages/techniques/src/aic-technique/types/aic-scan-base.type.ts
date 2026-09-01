import type { AICScanInterface } from '../interfaces/aic-scan.interface';

export type AICScanBaseType = Pick<
    AICScanInterface,
    | 'context'
    | 'endpointMarksByNodeIndex'
    | 'graph'
    | 'onPathByNodeIndex'
    | 'results'
    | 'sortedStrongNeighborsByIndex'
    | 'sortedWeakNeighborsByIndex'
    | 'target'
    | 'targetCellNodes'
>;
