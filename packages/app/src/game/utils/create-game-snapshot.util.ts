import type { GameSnapshotInterface } from '../interface/game-snapshot.interface';
import type { GameState } from '../store/game.state';

const copyCandidates = (candidates: Record<string, number[]>): Record<string, number[]> =>
    Object.fromEntries(Object.entries(candidates).map(([key, values]) => [key, [...values]]));

export const createGameSnapshot = (state: Pick<GameState, 'sudokuString' | 'candidates'>): GameSnapshotInterface => ({
    sudokuString: state.sudokuString,
    candidates: copyCandidates(state.candidates)
});
