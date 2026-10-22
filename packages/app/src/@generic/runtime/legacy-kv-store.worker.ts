import * as WaSqlite from '@effect/wa-sqlite';
import SQLiteESMFactory from '@effect/wa-sqlite/dist/wa-sqlite.mjs';
import { AccessHandlePoolVFS } from '@effect/wa-sqlite/src/examples/AccessHandlePoolVFS.js';
import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';

import { logErrorCause } from '../utils/log-error-cause.util';

const LegacyKvStoreRequestSchema = Schema.Struct({
    databaseName: Schema.String,
    directoryName: Schema.String,
    statement: Schema.String
});

const runLegacyKvStoreStatement = Effect.fn('runLegacyKvStoreStatement')(function* ({
    databaseName,
    directoryName,
    statement
}: typeof LegacyKvStoreRequestSchema.Type) {
    const factory = yield* Effect.promise((): Promise<unknown> => SQLiteESMFactory());
    const sqlite3 = WaSqlite.Factory(factory);
    const vfs = yield* Effect.acquireRelease(
        Effect.promise(() => AccessHandlePoolVFS.create(directoryName, factory)),
        accessHandlePool =>
            Effect.sync(() => {
                accessHandlePool.close();
            })
    );

    sqlite3.vfs_register(vfs, false);

    const database = yield* Effect.acquireRelease(
        Effect.try(() => sqlite3.open_v2(databaseName, WaSqlite.SQLITE_OPEN_READWRITE, directoryName)),
        openDatabase => Effect.sync(() => sqlite3.close(openDatabase))
    );
    const rows: unknown = yield* Effect.try(() => sqlite3.exec(database, statement));

    return yield* Schema.decodeUnknownEffect(Schema.Array(Schema.Array(Schema.NullOr(Schema.String))))(rows).pipe(
        Effect.map(decodedRows => decodedRows.at(0)?.at(0) ?? null)
    );
}, Effect.scoped);

self.addEventListener('message', event => {
    Effect.runFork(
        Schema.decodeUnknownEffect(LegacyKvStoreRequestSchema)(event.data).pipe(
            Effect.flatMap(runLegacyKvStoreStatement),
            Effect.tapCause(logErrorCause),
            Effect.catchCause(() => Effect.succeed(null)),
            Effect.flatMap(persistedRoot =>
                Effect.sync(() => {
                    self.postMessage(persistedRoot, { transfer: [] });
                })
            )
        )
    );
});
