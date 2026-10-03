import * as Effect from 'effect/Effect';

import { databaseBootAtom } from '../atoms/database-boot.atom';
import { appAtomRuntime } from '../runtime/app.runtime';

import type { AppServices } from '../runtime/app.runtime';
import type { ReactivityKeyEnum } from '@suuudokuuu/progress';

export const databaseQueryAtom = <A, E>(keys: readonly ReactivityKeyEnum[], effect: Effect.Effect<A, E, AppServices>) =>
    appAtomRuntime.factory.withReactivity(keys)(appAtomRuntime.atom(get => Effect.andThen(get.result(databaseBootAtom), effect)));
