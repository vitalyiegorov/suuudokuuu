export interface SolutionStepInterface {
    x: number;
    y: number;
    /** @description Correct filled cell value */
    value: number;
    /** @description Relative time in seconds from previous step */
    ts: number;
}
