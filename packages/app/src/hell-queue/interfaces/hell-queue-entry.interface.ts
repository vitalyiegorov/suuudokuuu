export interface HellQueueEntryInterface {
    readonly id: string;
    readonly puzzle: string;
    readonly solution: string;
    readonly givensCount: number;
    readonly createdAt: number;
    readonly generatorVersion: number;
    readonly schemaVersion: number;
}
