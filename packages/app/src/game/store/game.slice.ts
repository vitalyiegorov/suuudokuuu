import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { getCellKey } from '@suuudokuuu/field-core';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { SudokuScoring } from '../../scoring/classes/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';
import { gameApplyTechniqueUsageDelta } from '../utils/game-apply-technique-usage-delta.util';
import { gameFinishRun } from '../utils/game-finish-run.util';
import { gameGetPersistedAggregates } from '../utils/game-get-persisted-aggregates.util';
import { gameRedoPlacement } from '../utils/game-redo-placement.util';
import { gameUndoPlacement } from '../utils/game-undo-placement.util';
import { getTimelineTimestampDelta } from '../utils/get-timeline-timestamp-delta.util';
import { isLastTimelineEventAway } from '../utils/is-last-timeline-event-away.util';

import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { GameCellCandidatePayloadInterface } from '../interface/game-cell-candidate-payload.interface';
import type { GameFieldStatePayloadInterface } from '../interface/game-field-state-payload.interface';
import type { GameFinishPayloadInterface } from '../interface/game-finish-payload.interface';
import type { GameHintPayloadInterface } from '../interface/game-hint-payload.interface';
import type { GameSavePayloadInterface } from '../interface/game-save-payload.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const MillisecondsPerSecond = 1000;

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (
            state,
            action: PayloadAction<
                Pick<
                    GameState,
                    'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'isRatingCeiling' | 'maxMistakes' | 'rating' | 'sudokuString'
                >
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
            const { sudokuString, candidates, correctCell, scoredCells, technique } = action.payload;

            const scoring = new SudokuScoring(defaultScoringConfig);

            state.sudokuString = sudokuString;

            const score = scoring.calculate({
                scoredCells,
                difficulty: state.difficulty,
                mistakes: state.mistakes,
                elapsedTime: state.elapsedTime,
                maxMistakes: state.maxMistakes
            });

            state.score += score;
            state.undoneMoves = [];

            state.timelineEvents.push({
                kind: TimelineEventKindEnum.Cell,
                cellIndex: correctCell.y * defaultSudokuConfig.fieldSize + correctCell.x,
                value: correctCell.value,
                ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime),
                score,
                ...(isDefined(technique) && { technique })
            });

            if (isDefined(technique)) {
                gameApplyTechniqueUsageDelta(state.techniqueUsageCounts, technique, 1);
            }

            state.candidates = candidates;
        },
        hint: (state, action: PayloadAction<GameHintPayloadInterface>) => {
            const scoring = new SudokuScoring(defaultScoringConfig);
            const penalty = scoring.calculateHintPenalty({ difficulty: state.difficulty, maxMistakes: state.maxMistakes });

            state.score = Math.max(state.score - penalty, 0);
            state.undoneMoves = [];

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
        undo: (state, action: PayloadAction<GameFieldStatePayloadInterface>) => {
            const { sudokuString, candidates } = action.payload;
            const isValuePlacementUndone = state.sudokuString !== sudokuString;

            state.sudokuString = sudokuString;
            state.candidates = candidates;

            if (isValuePlacementUndone) {
                gameUndoPlacement(state);
            }
        },
        redo: (state, action: PayloadAction<GameFieldStatePayloadInterface>) => {
            const { sudokuString, candidates } = action.payload;
            const isValuePlacementRedone = state.sudokuString !== sudokuString;

            state.sudokuString = sudokuString;
            state.candidates = candidates;

            if (isValuePlacementRedone) {
                gameRedoPlacement(state);
            }
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
        toggleShowAutoCandidates: (state, action: PayloadAction<Pick<GameState, 'inputMode' | 'showAutoCandidates'>>) => {
            state.showAutoCandidates = action.payload.showAutoCandidates;
            state.inputMode = action.payload.inputMode;

            if (state.showAutoCandidates) {
                const hasRecordedAssist = state.timelineEvents.some(event => event.kind === TimelineEventKindEnum.AutoCandidates);

                if (!hasRecordedAssist) {
                    state.timelineEvents.push({
                        kind: TimelineEventKindEnum.AutoCandidates,
                        ts: getTimelineTimestampDelta(state.timelineEvents, state.elapsedTime)
                    });
                }
            }
        },
        toggleInputMode: (state, action: PayloadAction<Pick<GameState, 'inputMode' | 'showAutoCandidates'>>) => {
            state.inputMode = action.payload.inputMode;
            state.showAutoCandidates = action.payload.showAutoCandidates;
        },
        toggleCellCandidate: (state, action: PayloadAction<GameCellCandidatePayloadInterface>) => {
            const { candidates, cell } = action.payload;

            state.candidates = candidates;
            state.undoneMoves = [];

            if (state.isChallengeRun) {
                state.timelineEvents.push({
                    kind: TimelineEventKindEnum.Pencil,
                    cellIndex: cell.y * defaultSudokuConfig.fieldSize + cell.x,
                    value: cell.value,
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

        finish: (state, action: PayloadAction<GameFinishPayloadInterface>) => {
            gameFinishRun(state, action.payload);
        }
    }
});
