export interface SolutionStepInterface {
    /** @description Cell position in the 9x9 grid (0-80), calculated as y * 9 + x */
    cellIndex: number;
    value: number;
    ts: number;
}
