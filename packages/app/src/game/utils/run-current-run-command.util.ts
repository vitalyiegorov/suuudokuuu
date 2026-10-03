import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as AtomRegistry from 'effect/reactivity/AtomRegistry';

import { appAtomRegistry } from '../../@generic/constants/app-atom-registry.constant';
import { appRuntime } from '../../@generic/runtime/app.runtime';
import { currentRunAtom } from '../atoms/current-run.atom';

export const runCurrentRunCommand = (command: (currentRunService: CurrentRunService['Service']) => Effect.Effect<void>) =>
    appRuntime.runPromise(
        Effect.flatMap(CurrentRunService, command).pipe(
            Effect.andThen(AtomRegistry.getResult(appAtomRegistry, currentRunAtom, { suspendOnWaiting: true }))
        )
    );
