import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AtomRegistry from 'effect/reactivity/AtomRegistry';

import { appAtomRegistry } from '../../@generic/constants/app-atom-registry.constant';
import { appRuntime } from '../../@generic/runtime/app.runtime';
import { currentRunAtom } from '../query/use-current-run.query';

export const runCurrentRunCommand = <A>(command: (currentRunService: CurrentRunService['Service']) => Effect.Effect<A>) =>
    appRuntime.runPromise(
        Effect.flatMap(CurrentRunService, command).pipe(
            Effect.tap(() => AtomRegistry.getResult(appAtomRegistry, currentRunAtom, { suspendOnWaiting: true }))
        )
    );
