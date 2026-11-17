export interface ClassifierLayerInterface {
    readonly inSize: number;
    readonly inChannels: number;
    readonly outChannels: number;
    readonly kernel: number;
    readonly stride: number;
    readonly padding: number;
}
