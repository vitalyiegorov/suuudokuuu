import { runDatabaseMigrations } from '@suuudokuuu/contracts';
import * as Atom from 'effect/reactivity/Atom';

import { appAtomRuntime } from '../runtime/app.runtime';

export const databaseBootAtom = appAtomRuntime.atom(runDatabaseMigrations).pipe(Atom.keepAlive);
