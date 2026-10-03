import * as SqliteClient from '@effect/sql-sqlite-react-native/SqliteClient';
import { SqlNameTransforms } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as SqlClient from 'effect/sql/SqlClient';

import { DatabaseFileName } from '../constants/database-file-name.constant';

const sqlitePragmasLayer = Layer.effectDiscard(
    Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;

        yield* sql`PRAGMA journal_mode = WAL`;
        yield* sql`PRAGMA synchronous = NORMAL`;
    })
);

export const sqlPlatformLayer = sqlitePragmasLayer.pipe(
    Layer.provideMerge(SqliteClient.layer({ filename: DatabaseFileName, ...SqlNameTransforms })),
    Layer.orDie
);
