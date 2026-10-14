import { assert, describe, it } from '@effect/vitest';
import { GameStateSerializer, TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';

import { CompletedGameSchema } from '../../src/completed-game/schema/completed-game.schema';
import { initialCurrentRun } from '../../src/current-run/constant/initial-current-run.constant';
import { CurrentRunSchema, TimelineEventSchema } from '../../src/current-run/schema/current-run.schema';

const legacyCellEvent = {
    kind: TimelineEventKindEnum.Cell,
    cellIndex: 2,
    value: 4,
    ts: 7,
    technique: SolutionTechniqueEnum.NakedSingle,
    score: 0
} as const;

describe('Legacy timeline decoding', () => {
    it.effect('decodes current-run JSON columns without assisted or hint metadata', () =>
        Effect.gen(function* () {
            const encodedRun = yield* Schema.encodeEffect(CurrentRunSchema)(initialCurrentRun);
            const decodedRun = yield* Schema.decodeUnknownEffect(CurrentRunSchema)({
                ...encodedRun,
                timelineEvents: JSON.stringify([legacyCellEvent]),
                undoneMoves: JSON.stringify([legacyCellEvent]),
                challengeTimelineEvents: JSON.stringify([legacyCellEvent])
            });

            assert.deepStrictEqual(decodedRun.timelineEvents, [legacyCellEvent]);
            assert.deepStrictEqual(decodedRun.undoneMoves, [legacyCellEvent]);
            assert.deepStrictEqual(decodedRun.challengeTimelineEvents, [legacyCellEvent]);
            assert.notProperty(decodedRun.timelineEvents[0], 'assisted');
            assert.notProperty(decodedRun.timelineEvents[0], 'hinted');
        })
    );

    it.effect('decodes a completed-game row and its frozen legacy replay timeline without assisted or hint metadata', () =>
        Effect.gen(function* () {
            const completedGame = yield* Schema.decodeUnknownEffect(CompletedGameSchema)({
                difficulty: DifficultyEnum.Medium,
                encodedState: '_OwPIThhRGUxFDDkJq4zrJuyYhUEGSYmTqAalQDDhYCWCCwEA',
                rating: 0,
                isRatingCeiling: 0,
                elapsedTime: 0,
                score: 0,
                mistakes: 0,
                maxMistakes: 3,
                completedAt: 0,
                dailyDayNumber: null
            });
            const decodedState = new GameStateSerializer().decodeState(completedGame.encodedState);
            const timeline = yield* Schema.decodeUnknownEffect(Schema.Array(TimelineEventSchema))(decodedState.timelineEvents);

            assert.deepStrictEqual(timeline[0], { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 7 });
            assert.deepStrictEqual(timeline, decodedState.timelineEvents);
            assert.notProperty(timeline[0], 'assisted');
            assert.notProperty(timeline[0], 'hinted');
            assert.isNull(decodedState.hints);
        })
    );
});
