import type { GameSnapshotInterface } from './game-snapshot.interface';

export interface GameUndoRedoStateInterface {
    isChallengeRun: boolean;
    maxMistakes: number;
    score: number;
    lastUndoScorePenalty: number;
    sudokuString: string;
    candidates: Record<string, number[]>;
    undoStack: GameSnapshotInterface[];
    redoStack: GameSnapshotInterface[];
}
