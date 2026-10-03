import * as Effect from 'effect/Effect';
import * as Reactivity from 'effect/reactivity/Reactivity';

import { ReactivityKeyEnum } from '../src/@generic/enum/reactivity-key.enum';

export const trackInvalidations = Effect.gen(function* () {
    const reactivity = yield* Reactivity.Reactivity;
    const invalidatedKeys: ReactivityKeyEnum[] = [];

    for (const key of Object.values(ReactivityKeyEnum)) {
        yield* Effect.acquireRelease(
            Effect.sync(() => reactivity.registerUnsafe([key], () => invalidatedKeys.push(key))),
            unregister => Effect.sync(unregister)
        );
    }

    return invalidatedKeys;
});
