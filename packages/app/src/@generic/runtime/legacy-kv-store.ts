import { ANDROID_FILES_PATH, IOS_DOCUMENT_PATH, open } from '@op-engineering/op-sqlite';
import { LegacyKvStoreConstant } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import { Platform } from 'react-native';

import { isString } from '@rnw-community/shared';

import type { DB } from '@op-engineering/op-sqlite';

const legacyKvStoreDirectory = `${Platform.OS === 'ios' ? IOS_DOCUMENT_PATH : ANDROID_FILES_PATH}/SQLite`;

const withLegacyKvStore = <A>(query: (database: DB) => A) =>
    Effect.acquireUseRelease(
        Effect.option(
            Effect.try(() => open({ failOnCreate: true, location: legacyKvStoreDirectory, name: LegacyKvStoreConstant.databaseName }))
        ),
        database =>
            Option.match(database, {
                onNone: () => Effect.succeed(null),
                onSome: openDatabase => Effect.try(() => query(openDatabase))
            }),
        database =>
            Effect.sync(() => {
                if (Option.isSome(database)) {
                    database.value.close();
                }
            })
    );

export const readLegacyPersistedRoot = withLegacyKvStore(database => {
    const persistedRoot = database.executeSync(LegacyKvStoreConstant.selectPersistedRootSql).rows.at(0)?.['value'];

    return isString(persistedRoot) ? persistedRoot : null;
});

export const removeLegacyPersistedRoot = Effect.asVoid(
    withLegacyKvStore(database => database.executeSync(LegacyKvStoreConstant.deletePersistedRootSql))
);
