import { ANDROID_FILES_PATH, IOS_DOCUMENT_PATH, open } from '@op-engineering/op-sqlite';
import { LegacyKvStoreConstant } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

import { isString } from '@rnw-community/shared';

import type { DB } from '@op-engineering/op-sqlite';

const legacyKvStoreDirectory = `${Platform.OS === 'ios' ? IOS_DOCUMENT_PATH : ANDROID_FILES_PATH}/${LegacyKvStoreConstant.nativeDirectoryName}`;

const withLegacyKvStore = <A>(query: (database: DB) => A) =>
    Effect.flatMap(
        Effect.sync(() => new File(Paths.document, LegacyKvStoreConstant.nativeDirectoryName, LegacyKvStoreConstant.databaseName).exists),
        hasLegacyKvStore =>
            hasLegacyKvStore
                ? Effect.acquireUseRelease(
                      Effect.try(() =>
                          open({ failOnCreate: true, location: legacyKvStoreDirectory, name: LegacyKvStoreConstant.databaseName })
                      ),
                      database => Effect.try(() => query(database)),
                      database =>
                          Effect.sync(() => {
                              database.close();
                          })
                  )
                : Effect.succeed(null)
    );

export const readLegacyPersistedRoot = withLegacyKvStore(database => {
    const persistedRoot = database.executeSync(LegacyKvStoreConstant.selectPersistedRootSql).rows.at(0)?.['value'];

    return isString(persistedRoot) ? persistedRoot : null;
});

export const removeLegacyPersistedRoot = Effect.asVoid(
    withLegacyKvStore(database => database.executeSync(LegacyKvStoreConstant.deletePersistedRootSql))
);
