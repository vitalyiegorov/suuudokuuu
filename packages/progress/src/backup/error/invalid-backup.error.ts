import * as Schema from 'effect/Schema';

export class InvalidBackupError extends Schema.TaggedError<InvalidBackupError>()('InvalidBackupError', {}) {}
