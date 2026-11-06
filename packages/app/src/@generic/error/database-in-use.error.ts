import * as Schema from 'effect/Schema';

export class DatabaseInUseError extends Schema.TaggedError<DatabaseInUseError, { readonly brand: unique symbol }>()(
    'DATABASE_IN_USE',
    {}
) {}
