import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Schema from 'effect/Schema';

import { DifficultySchema } from '../../@generic/schema/difficulty.schema';

export const CellTimelineEventSchema = Schema.Struct({
    kind: Schema.Literal(TimelineEventKindEnum.Cell),
    cellIndex: Schema.Number,
    value: Schema.Number,
    ts: Schema.Number,
    technique: Schema.optionalKey(Schema.Enum(SolutionTechniqueEnum)),
    score: Schema.optionalKey(Schema.Number)
});

export const TimelineEventSchema = Schema.Union([
    CellTimelineEventSchema,
    Schema.Struct({
        kind: Schema.Literals([TimelineEventKindEnum.Pencil, TimelineEventKindEnum.Mistake]),
        cellIndex: Schema.Number,
        value: Schema.Number,
        ts: Schema.Number
    }),
    Schema.Struct({
        kind: Schema.Literals([
            TimelineEventKindEnum.InputMode,
            TimelineEventKindEnum.AutoCandidates,
            TimelineEventKindEnum.Away,
            TimelineEventKindEnum.Return,
            TimelineEventKindEnum.Pause,
            TimelineEventKindEnum.Resume,
            TimelineEventKindEnum.Screenshot,
            TimelineEventKindEnum.Hint
        ]),
        ts: Schema.Number
    })
]);

const TimelineEventsSchema = Schema.fromJsonString(Schema.Array(TimelineEventSchema));

export const CurrentRunSchema = Schema.Struct({
    sudokuString: Schema.String,
    difficulty: DifficultySchema,
    rating: Schema.Number,
    isRatingCeiling: Schema.BooleanFromBit,
    score: Schema.Number,
    mistakes: Schema.Number,
    maxMistakes: Schema.Number,
    elapsedTime: Schema.Number,
    isPaused: Schema.BooleanFromBit,
    shouldShowPauseScreen: Schema.BooleanFromBit,
    shouldResumeOnFocus: Schema.BooleanFromBit,
    showAutoCandidates: Schema.BooleanFromBit,
    inputMode: Schema.Literals(['normal', 'candidate']),
    candidates: Schema.fromJsonString(Schema.Record(Schema.String, Schema.Array(Schema.Number))),
    eliminatedCandidates: Schema.fromJsonString(Schema.Record(Schema.String, Schema.Array(Schema.Number))),
    timelineEvents: TimelineEventsSchema,
    undoneMoves: Schema.fromJsonString(Schema.Array(CellTimelineEventSchema)),
    challengeTimelineEvents: TimelineEventsSchema,
    challengeState: Schema.String,
    challengeTime: Schema.Number,
    wallClockStartMs: Schema.Number,
    isChallengeRun: Schema.BooleanFromBit,
    dailyDayNumber: Schema.Number,
    hasNewPersonalBestScore: Schema.BooleanFromBit
});
