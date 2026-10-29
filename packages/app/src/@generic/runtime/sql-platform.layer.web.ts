import * as SqliteClient from '@effect/sql-sqlite-wasm/SqliteClient';
import { SqlNameTransforms } from '@suuudokuuu/progress';
import * as Deferred from 'effect/Deferred';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as SqlClient from 'effect/sql/SqlClient';

import { isDefined } from '@rnw-community/shared';

import { DatabaseInUseError } from '../error/database-in-use.error';

const workerInitializationTimeoutMilliseconds = 15000;

const sqliteWorker = Effect.gen(function* () {
    const released = yield* Deferred.make<boolean>();
    const context = yield* Effect.context();

    yield* Effect.acquireRelease(
        Effect.callback<boolean, DatabaseInUseError>(resume => {
            window.navigator.locks
                .request('suuudokuuu-opfs', { ifAvailable: true }, lock => {
                    if (!isDefined(lock)) {
                        resume(new DatabaseInUseError());

                        return false;
                    }

                    resume(Effect.succeed(true));

                    return Effect.runPromiseWith(context)(Deferred.await(released));
                })
                .catch((cause: unknown) => {
                    resume(Effect.die(cause));
                });
        }),
        () => Deferred.succeed(released, true)
    );

    return yield* Effect.acquireRelease(
        Effect.sync(() => new Worker(new URL('./sqlite-opfs.worker', window.location.href))),
        worker =>
            Effect.sync(() => {
                worker.terminate();
            })
    );
}).pipe(Effect.orDie);

const isOpfsAvailable = Effect.isSuccess(Effect.tryPromise(() => window.navigator.storage.getDirectory()));

export const sqlPlatformLayer = Layer.unwrap(
    Effect.map(isOpfsAvailable, isAvailable =>
        isAvailable
            ? Layer.effect(
                  SqlClient.SqlClient,
                  SqliteClient.make({ worker: sqliteWorker, ...SqlNameTransforms }).pipe(
                      Effect.timeout(workerInitializationTimeoutMilliseconds)
                  )
              ).pipe(Layer.provide(Reactivity.layer))
            : SqliteClient.layerMemory(SqlNameTransforms)
    )
).pipe(Layer.orDie);
