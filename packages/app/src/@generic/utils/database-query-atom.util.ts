import { appAtomRuntime } from '../runtime/app.runtime';

import type { AppServices } from '../runtime/app.runtime';
import type { ReactivityKeyEnum } from '@suuudokuuu/contracts';
import type * as Effect from 'effect/Effect';

export const databaseQueryAtom = <A, E>(keys: readonly ReactivityKeyEnum[], effect: Effect.Effect<A, E, AppServices>) =>
    appAtomRuntime.factory.withReactivity(keys)(appAtomRuntime.atom(effect));
