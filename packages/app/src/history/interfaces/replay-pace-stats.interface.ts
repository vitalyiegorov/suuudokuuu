export interface ReplayPaceStatsInterface {
    readonly totalTimeSeconds: number;
    readonly averageSecondsPerPlacement: number;
    readonly longestPauseSeconds: number;
    readonly awaySeconds: number;
    readonly pencilCount: number;
    readonly autoCandidatesUsed: boolean;
    readonly mistakesCount: number;
}
