import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { getDayNumber } from '../../@generic/utils/get-day-number.util';
import { maxCompletedGamesPerDifficulty } from '../../history/constants/max-completed-games-per-difficulty.constant';
import { SudokuScoring } from '../../scoring/classes/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';
import { addPlayedDayNumber } from '../utils/add-played-day-number.util';
import { gameGetPersistedAggregates } from '../utils/game-get-persisted-aggregates.util';
import { gameStateToString } from '../utils/game-state-to-string.util';
import { getTimelineTimestampDelta } from '../utils/get-timeline-timestamp-delta.util';
import { isLastTimelineEventAway } from '../utils/is-last-timeline-event-away.util';

import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { GameHintPayloadInterface } from '../interface/game-hint-payload.interface';
import type { GameSavePayloadInterface } from '../interface/game-save-payload.interface';
import type { CellInterface, DifficultyEnum } from '@suuudokuuu/generator';

const MillisecondsPerSecond = 1000;

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (
            state,
            action: PayloadAction<
                Pick<GameState, 'sudokuString' | 'difficulty' | 'maxMistakes' | 'isChallengeRun' | 'rating' | 'isRatingCeiling'>
            >
        ) => {
            Object.assign(state, { ...initialGameState, ...gameGetPersistedAggregates(state) }, action.payload);
        },
        pause: (state, action: PayloadAction<{ shouldShowPauseScreen?: boolean } | undefined>) => {
            if (state.isChallengeRun) {
                return;
            }

            const shouldShowPauseScreen = action.payload?.shouldShowPauseScreen ?? true;

            state.isPaused = true;
            state.shouldShowPauseScreen = shouldShowPauseScreen;
            state.shouldResumeOnFocus = !shouldShowPauseScreen;
        },
        challengeClockSync: (state, action: PayloadAction<{ nowMs: number }>) => {
            if (!state.isChallengeRun) {
                return;
            }

            if (state.wallClockStartMs === 0) {
                state.wallClockStartMs = action.payload.nowMs - state.elapsedTime * MillisecondsPerSecond;

                return;
            }

            const wallElapsedSeconds = Math.floor((action.payload.nowMs - state.wallClockStartMs) / MillisecondsPerSecond);
            if (wallElapsedSeconds > state.elapsedTime) {
                state.elapsedTime = wallElapsedSeconds;
            }
        },
        timelineAway: state => {
            if (!state.isChallengeRun || isLastTimelineEventAway(state.timelineEvents)) {
                return;
            }

            state.timelineEvents.push({
                kind: TimelineEventKindEnum.Away,
                ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime)
            });
        },
        timelineReturn: state => {
            if (!isLastTimelineEventAway(state.timelineEvents)) {
                return;
            }

            const ts = getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime);

            if (ts === 0) {
                state.timelineEvents.pop();

                return;
            }

            state.timelineEvents.push({ kind: TimelineEventKindEnum.Return, ts });
        },
        resume: state => {
            state.isPaused = false;
            state.shouldShowPauseScreen = false;
            state.shouldResumeOnFocus = false;
        },
        save: (state, action: PayloadAction<GameSavePayloadInterface>) => {
            const { sudoku, correctCell, scoredCells, technique } = action.payload;

            const scoring = new SudokuScoring(defaultScoringConfig);

            state.sudokuString = sudoku.toString();

            state.score += scoring.calculate({
                scoredCells,
                difficulty: state.difficulty,
                mistakes: state.mistakes,
                elapsedTime: state.elapsedTime,
                maxMistakes: state.maxMistakes
            });

            state.timelineEvents.push({
                kind: TimelineEventKindEnum.Cell,
                cellIndex: correctCell.y * defaultSudokuConfig.fieldSize + correctCell.x,
                value: correctCell.value,
                ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime),
                ...(isDefined(technique) && { technique })
            });

            if (isDefined(technique)) {
                state.techniqueUsageCounts[technique] = (state.techniqueUsageCounts[technique] ?? 0) + 1;
            }

            state.candidates[getCellKey(correctCell)] = [];

            sudoku.Field.forEach(
                row =>
                    void row.forEach(cell => {
                        if (
                            sudoku.isBlankCell(cell) &&
                            (cell.x === correctCell.x || cell.y === correctCell.y || cell.group === correctCell.group)
                        ) {
                            const possibleCandidates = sudoku.getCellCandidates(cell);

                            const key = getCellKey(cell);
                            const currentCandidates = state.candidates[key] ?? [];

                            state.candidates[key] = currentCandidates.filter(candidate => possibleCandidates.includes(candidate));
                        }
                    })
            );
        },
        hint: (state, action: PayloadAction<GameHintPayloadInterface>) => {
            const scoring = new SudokuScoring(defaultScoringConfig);
            const penalty = scoring.calculateHintPenalty({ difficulty: state.difficulty, maxMistakes: state.maxMistakes });

            state.score = Math.max(state.score - penalty, 0);

            state.timelineEvents.push({
                kind: TimelineEventKindEnum.Hint,
                ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime)
            });

            action.payload.eliminations.forEach(elimination => {
                const key = getCellKey(elimination.cell);
                const cellCandidates = state.candidates[key];

                if (isDefined(cellCandidates)) {
                    state.candidates[key] = cellCandidates.filter(candidate => candidate !== elimination.value);
                }
            });
        },
        mistake: (state, action: PayloadAction<CellInterface>) => {
            state.mistakes += 1;

            state.timelineEvents.push({
                kind: TimelineEventKindEnum.Mistake,
                cellIndex: action.payload.y * defaultSudokuConfig.fieldSize + action.payload.x,
                value: action.payload.value,
                ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime)
            });
        },
        load: (state, action: PayloadAction<Partial<GameState>>) => {
            Object.assign(state, action.payload, gameGetPersistedAggregates(state));
        },
        tick: state => {
            if (!state.isPaused && isNotEmptyString(state.sudokuString)) {
                state.elapsedTime += 1;
            }
        },
        reset: state => {
            Object.assign(state, { ...initialGameState, ...gameGetPersistedAggregates(state) });
        },
        toggleShowAutoCandidates: state => {
            state.showAutoCandidates = !state.showAutoCandidates;

            if (state.showAutoCandidates) {
                state.inputMode = 'normal';

                const hasRecordedAssist = state.timelineEvents.some(event => event.kind === TimelineEventKindEnum.AutoCandidates);

                if (!hasRecordedAssist) {
                    state.timelineEvents.push({
                        kind: TimelineEventKindEnum.AutoCandidates,
                        ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime)
                    });
                }
            }
        },
        toggleInputMode: state => {
            const newMode = state.inputMode === 'normal' ? 'candidate' : 'normal';
            state.inputMode = newMode;

            if (newMode === 'candidate') {
                state.showAutoCandidates = false;
            }
        },
        toggleCellCandidate: (state, action: PayloadAction<CellInterface>) => {
            const { value } = action.payload;

            const key = getCellKey(action.payload);
            const candidates = state.candidates[key] ?? [];

            if (candidates.includes(value)) {
                state.candidates[key] = candidates.filter(val => val !== value);
            } else {
                state.candidates[key] = [...candidates, value];
            }

            if (state.isChallengeRun) {
                state.timelineEvents.push({
                    kind: TimelineEventKindEnum.Pencil,
                    cellIndex: action.payload.y * defaultSudokuConfig.fieldSize + action.payload.x,
                    value,
                    ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime)
                });
            }
        },
        screenshot: state => {
            if (!state.isChallengeRun) {
                return;
            }

            state.timelineEvents.push({
                kind: TimelineEventKindEnum.Screenshot,
                ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime)
            });
        },

        // eslint-disable-next-line max-statements
        finish: (state, action: PayloadAction<{ difficulty: DifficultyEnum; isWon: boolean; isChallenge?: boolean }>) => {
            const { difficulty, isWon, isChallenge = false } = action.payload;
            const history = state.historyByDifficulty[difficulty];
            const hasNewPersonalBestScore =
                isWon && !isChallenge && !isNotEmptyString(state.challengeState) && state.score > history.bestScore;

            state.hasNewPersonalBestScore = hasNewPersonalBestScore;
            state.playedDayNumbers = addPlayedDayNumber(state.playedDayNumbers, getDayNumber(Date.now()));

            history.gamesCompleted += 1;

            if (isWon) {
                history.averageTime = (history.averageTime * history.gamesWon + state.elapsedTime) / (history.gamesWon + 1);

                if (history.bestTime === 0 || state.elapsedTime < history.bestTime) {
                    history.bestTime = state.elapsedTime;
                }

                history.gamesWon += 1;
                history.gamesWonWithoutMistakes += state.mistakes === 0 ? 1 : 0;
                history.hardcoreWon += state.maxMistakes === 0 ? 1 : 0;
                history.challengesWon += isChallenge ? 1 : 0;
                history.completedGames = [
                    {
                        difficulty,
                        rating: state.rating,
                        isRatingCeiling: state.isRatingCeiling,
                        encodedState: gameStateToString(state, SharedPayloadKindEnum.Handoff),
                        elapsedTime: state.elapsedTime,
                        score: state.score,
                        mistakes: state.mistakes,
                        maxMistakes: state.maxMistakes,
                        completedAt: Date.now()
                    },
                    ...history.completedGames
                ].slice(0, maxCompletedGamesPerDifficulty);

                if (state.score > history.bestScore) {
                    history.bestScore = state.score;
                }

                if (state.rating > history.bestRating.rating) {
                    history.bestRating = { rating: state.rating, isRatingCeiling: state.isRatingCeiling };
                }
            } else {
                history.gamesLost += 1;
                history.challengesLost += isChallenge ? 1 : 0;
            }

            state.isPaused = true;
            state.shouldShowPauseScreen = false;
            state.shouldResumeOnFocus = false;
        }
    }
});
