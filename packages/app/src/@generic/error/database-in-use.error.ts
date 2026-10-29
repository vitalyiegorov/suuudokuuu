import * as Schema from 'effect/Schema';

export class DatabaseInUseError extends Schema.TaggedError<DatabaseInUseError>()('DATABASE_IN_USE', {}) {}
