export interface HypothesisPlacementsInterface {
    readonly placedValues: Int8Array;
    readonly placedCellIndexes: number[];
    readonly placementOrders: Int8Array;
    readonly placementReasons: number[];
}
