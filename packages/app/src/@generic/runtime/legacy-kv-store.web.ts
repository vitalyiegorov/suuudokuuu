import { LegacyKvStoreConstant } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';

const hasLegacyKvStore = Effect.isSuccess(
    Effect.tryPromise(() => window.navigator.storage.getDirectory()).pipe(
        Effect.flatMap(storageRoot => Effect.tryPromise(() => storageRoot.getDirectoryHandle(LegacyKvStoreConstant.webDirectoryName)))
    )
);

const legacyKvStoreWorker = Effect.acquireRelease(
    Effect.sync(() => new Worker(new URL('./legacy-kv-store.worker', window.location.href))),
    worker =>
        Effect.sync(() => {
            worker.terminate();
        })
);

const runLegacyKvStoreStatement = Effect.fn('runLegacyKvStoreStatement')(function* (statement: string) {
    if (!(yield* hasLegacyKvStore)) {
        return null;
    }

    const worker = yield* legacyKvStoreWorker;
    const response = yield* Effect.callback<unknown>(resume => {
        const handleMessage = (event: MessageEvent<unknown>) => {
            resume(Effect.succeed(event.data));
        };
        const handleError = (event: ErrorEvent) => {
            resume(Effect.die(event.message));
        };

        worker.addEventListener('message', handleMessage);
        worker.addEventListener('error', handleError);
        worker.postMessage(
            { databaseName: LegacyKvStoreConstant.databaseName, directoryName: LegacyKvStoreConstant.webDirectoryName, statement },
            { transfer: [] }
        );

        return Effect.sync(() => {
            worker.removeEventListener('message', handleMessage);
            worker.removeEventListener('error', handleError);
        });
    });

    return yield* Schema.decodeUnknownEffect(Schema.NullOr(Schema.String))(response);
}, Effect.scoped);

export const readLegacyPersistedRoot = runLegacyKvStoreStatement(LegacyKvStoreConstant.selectPersistedRootSql);

export const removeLegacyPersistedRoot = Effect.asVoid(runLegacyKvStoreStatement(LegacyKvStoreConstant.deletePersistedRootSql));
