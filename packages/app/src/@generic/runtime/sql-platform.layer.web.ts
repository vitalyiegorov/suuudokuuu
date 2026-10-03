import * as SqliteClient from '@effect/sql-sqlite-wasm/SqliteClient';
import { SqlNameTransforms } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';

const sqliteWorker = Effect.acquireRelease(
    Effect.sync(() => new Worker(new URL('./sqlite-opfs.worker', window.location.href))),
    worker =>
        Effect.sync(() => {
            worker.terminate();
        })
);

const isOpfsAvailable = Effect.isSuccess(Effect.tryPromise(() => window.navigator.storage.getDirectory()));

export const sqlPlatformLayer = Layer.unwrap(
    Effect.map(isOpfsAvailable, isAvailable =>
        isAvailable ? SqliteClient.layer({ worker: sqliteWorker, ...SqlNameTransforms }) : SqliteClient.layerMemory(SqlNameTransforms)
    )
).pipe(Layer.orDie);
