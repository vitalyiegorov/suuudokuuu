import * as SqliteClient from '@effect/sql-sqlite-wasm/SqliteClient';
import { SqlNameTransforms } from '@suuudokuuu/progress';
import * as Deferred from 'effect/Deferred';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';
import * as SqlClient from 'effect/sql/SqlClient';

import { isDefined } from '@rnw-community/shared';

import { DatabaseInUseError } from '../error/database-in-use.error';

const databaseInitializationTimeoutMilliseconds = 15000;

const sqliteWorker = Effect.gen(function* () {
    const released = yield* Deferred.make<boolean>();
    const context = yield* Effect.context();

    yield* Effect.addFinalizer(() => Deferred.succeed(released, true));
    yield* Effect.callback<boolean, DatabaseInUseError>(resume => {
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
    });

    return yield* Effect.acquireRelease(
        Effect.sync(() => new Worker(new URL('./sqlite-opfs.worker', window.location.href))),
        worker =>
            Effect.sync(() => {
                worker.terminate();
            })
    );
}).pipe(Effect.orDie);

export const sqlPlatformLayer = Layer.effect(
    SqlClient.SqlClient,
    Effect.gen(function* () {
        const isOpfsAvailable = yield* Effect.isSuccess(Effect.tryPromise(() => window.navigator.storage.getDirectory()));

        return yield* isOpfsAvailable
            ? SqliteClient.make({ worker: sqliteWorker, ...SqlNameTransforms })
            : SqliteClient.makeMemory(SqlNameTransforms);
    }).pipe(Effect.timeout(databaseInitializationTimeoutMilliseconds))
).pipe(Layer.provide(Reactivity.layer), Layer.orDie);
