import { DifficultyEnum } from '@suuudokuuu/generator';

import { emptyGameHistory } from '../../history/interfaces/history-game.interface';

import type { HistoryGameInterface } from '../../history/interfaces/history-game.interface';
import type { GameSnapshotInterface } from '../interface/game-snapshot.interface';
import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface GameState {
    sudokuString: string;
    difficulty: DifficultyEnum;
    rating: number;
    isRatingCeiling: boolean;
    score: number;
    mistakes: number;
    maxMistakes: number;
    elapsedTime: number;
    isPaused: boolean;
    shouldShowPauseScreen: boolean;
    shouldResumeOnFocus: boolean;
    showAutoCandidates: boolean;
    inputMode: 'normal' | 'candidate';
    candidates: Record<string, number[]>;
    timelineEvents: GameTimelineEventInterface[];
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    challengeTimelineEvents: GameTimelineEventInterface[];
    challengeTime: number;
    challengeState: string;
    wallClockStartMs: number;
    isChallengeRun: boolean;
    hasNewPersonalBestScore: boolean;
    techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>;
    playedDayNumbers: number[];
    undoStack: GameSnapshotInterface[];
    redoStack: GameSnapshotInterface[];
    lastUndoScorePenalty: number;
}

export const initialGameState: GameState = {
    isPaused: false,
    shouldShowPauseScreen: false,
    shouldResumeOnFocus: false,
    elapsedTime: 0,
    sudokuString: '',
    difficulty: DifficultyEnum.Newbie,
    rating: 0,
    isRatingCeiling: false,
    mistakes: 0,
    maxMistakes: 3,
    score: 0,
    showAutoCandidates: false,
    inputMode: 'normal',
    candidates: {},
    historyByDifficulty: {
        [DifficultyEnum.Newbie]: { ...emptyGameHistory, difficulty: DifficultyEnum.Newbie },
        [DifficultyEnum.Easy]: { ...emptyGameHistory, difficulty: DifficultyEnum.Easy },
        [DifficultyEnum.Medium]: { ...emptyGameHistory, difficulty: DifficultyEnum.Medium },
        [DifficultyEnum.Hard]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hard },
        [DifficultyEnum.Nightmare]: { ...emptyGameHistory, difficulty: DifficultyEnum.Nightmare },
        [DifficultyEnum.Hell]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hell },
        [DifficultyEnum.Infinity]: { ...emptyGameHistory, difficulty: DifficultyEnum.Infinity }
    },
    timelineEvents: [],
    challengeTimelineEvents: [],
    challengeTime: 0,
    challengeState: '',
    wallClockStartMs: 0,
    isChallengeRun: false,
    hasNewPersonalBestScore: false,
    techniqueUsageCounts: {},
    playedDayNumbers: [],
    undoStack: [],
    redoStack: [],
    lastUndoScorePenalty: 0
};
