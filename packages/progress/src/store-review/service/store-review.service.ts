import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import * as Clock from 'effect/Clock';
import * as Context from 'effect/Context';
import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';
import * as SqlSchema from 'effect/sql/SqlSchema';

import { CurrentRunRepository } from '../../current-run/repository/current-run.repository';

const minimumGamesWon = 3;
const requestIntervalMs = Duration.toMillis('120 days');

const StoreReviewSchema = Schema.Struct({ requestedAt: Schema.Number, appVersion: Schema.String });

export class StoreReviewService extends Context.Service<StoreReviewService>()('@suuudokuuu/progress/StoreReviewService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const currentRunRepository = yield* CurrentRunRepository;
        const findGamesWon = SqlSchema.findOne({
            Request: Schema.Void,
            Result: Schema.Struct({ gamesWon: Schema.Number }),
            execute: () => sql`SELECT COALESCE(SUM(games_won), 0) AS games_won FROM difficulty_stats`
        });
        const findLastRequest = SqlSchema.findOneOption({
            Request: Schema.Void,
            Result: StoreReviewSchema,
            execute: () => sql`SELECT requested_at, app_version FROM store_review`
        });
        const replaceLastRequest = SqlSchema.void({
            Request: StoreReviewSchema,
            execute: request => sql`INSERT OR REPLACE INTO store_review ${sql.insert({ id: 1, ...request })}`
        });

        return {
            claimAfterWin: Effect.fn('StoreReviewService.claimAfterWin')(
                function* (appVersion: string) {
                    const nowMs = yield* Clock.currentTimeMillis;
                    const currentRun = yield* currentRunRepository.get;
                    const { gamesWon } = yield* findGamesWon();
                    const lastRequest = yield* findLastRequest();
                    const isHintAssisted = Option.exists(currentRun, run =>
                        run.timelineEvents.some(event => event.kind === TimelineEventKindEnum.Hint)
                    );
                    const isThrottled = Option.exists(
                        lastRequest,
                        request => request.appVersion === appVersion || nowMs - request.requestedAt < requestIntervalMs
                    );

                    if (Option.isNone(currentRun) || isHintAssisted || isThrottled || gamesWon < minimumGamesWon) {
                        return false;
                    }

                    yield* replaceLastRequest({ requestedAt: nowMs, appVersion });

                    return true;
                },
                effect => sql.withTransaction(effect),
                Effect.orDie
            )
        };
    })
}) {
    static readonly layer = Layer.effect(StoreReviewService, StoreReviewService.make).pipe(Layer.provide(CurrentRunRepository.layer));
}
