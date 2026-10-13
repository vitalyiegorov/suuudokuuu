import * as Cause from 'effect/Cause';
import * as Effect from 'effect/Effect';

export const logErrorCause = (cause: Cause.Cause<unknown>) => (Cause.hasInterruptsOnly(cause) ? Effect.void : Effect.logError(cause));
