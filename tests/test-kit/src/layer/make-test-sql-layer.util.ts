import * as SqliteClient from '@effect/sql-sqlite-node/SqliteClient';
import { SqlNameTransforms, runDatabaseMigrations } from '@suuudokuuu/progress';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';

export const makeTestSqlLayer = () =>
    Layer.effectDiscard(runDatabaseMigrations).pipe(
        Layer.provideMerge(SqliteClient.layer({ filename: ':memory:', ...SqlNameTransforms })),
        Layer.provideMerge(Reactivity.layer)
    );
