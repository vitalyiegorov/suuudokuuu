import * as SqliteClient from '@effect/sql-sqlite-node/SqliteClient';
import { SqlNameTransforms } from '@suuudokuuu/progress';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';

export const makeTestSqlClientLayer = (filename = ':memory:') =>
    SqliteClient.layer({ filename, ...SqlNameTransforms }).pipe(Layer.provideMerge(Reactivity.layer));
