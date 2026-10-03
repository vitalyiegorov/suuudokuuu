import * as SqliteClient from '@effect/sql-sqlite-wasm/SqliteClient';
import { SqlNameTransforms } from '@suuudokuuu/contracts';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';

const sqliteWorker = Effect.acquireRelease(
    Effect.sync(() => new Worker(new URL('./sqlite-opfs.worker', window.location.href))),
    worker =>
        Effect.sync(() => {
            worker.terminate();
        })
);

export const sqlPlatformLayer = SqliteClient.layer({ worker: sqliteWorker, ...SqlNameTransforms }).pipe(Layer.orDie);
