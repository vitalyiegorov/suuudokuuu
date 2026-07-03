export interface SolutionTechniqueStatsInterface {
    countsByTechnique: Record<number, number>;
    totalMoves: number;
    logicalMoves: number;
    guessLikeMoves: number;
    hardestTechnique: number;
}
