import { runDatabaseMigrations } from '@suuudokuuu/progress';
import * as Layer from 'effect/Layer';

import { makeTestSqlClientLayer } from './make-test-sql-client-layer.util';

export const makeTestSqlLayer = () => Layer.effectDiscard(runDatabaseMigrations).pipe(Layer.provideMerge(makeTestSqlClientLayer()));
