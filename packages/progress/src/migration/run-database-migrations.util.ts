import * as Migrator from 'effect/sql/Migrator';

import { initialMigration } from './0001-initial.migration';

export const runDatabaseMigrations = Migrator.make({})({
    loader: Migrator.fromRecord({ '0001_initial': initialMigration })
});
