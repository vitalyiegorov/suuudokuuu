import * as SqliteClient from '@effect/sql-sqlite-node/SqliteClient';
import { SqlNameTransforms } from '@suuudokuuu/progress';
import * as Layer from 'effect/Layer';
import * as Reactivity from 'effect/reactivity/Reactivity';

export const makeTestSqlClientLayer = () =>
    SqliteClient.layer({ filename: ':memory:', ...SqlNameTransforms }).pipe(Layer.provideMerge(Reactivity.layer));
