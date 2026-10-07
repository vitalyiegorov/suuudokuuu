import { DifficultyEnum } from '@suuudokuuu/generator';

import type { CurrentRunType } from '../type/current-run.type';

export const initialCurrentRun: CurrentRunType = {
    sudokuString: '',
    difficulty: DifficultyEnum.Newbie,
    rating: 0,
    isRatingCeiling: false,
    score: 0,
    mistakes: 0,
    maxMistakes: 3,
    elapsedTime: 0,
    isPaused: false,
    shouldShowPauseScreen: false,
    shouldResumeOnFocus: false,
    showAutoCandidates: false,
    inputMode: 'normal',
    candidates: {},
    eliminatedCandidates: {},
    timelineEvents: [],
    undoneMoves: [],
    challengeTimelineEvents: [],
    challengeState: '',
    challengeTime: 0,
    wallClockStartMs: 0,
    isChallengeRun: false,
    dailyDayNumber: 0,
    hasNewPersonalBestScore: false
};
