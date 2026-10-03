import { useAtomValue } from '@effect/atom-react/Hooks';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { useState } from 'react';

import type * as Atom from 'effect/reactivity/Atom';

export const useLiveAtomValue = <A, E>(atom: Atom.Atom<AsyncResult.AsyncResult<A, E>>): AsyncResult.AsyncResult<A, E> => {
    const result = useAtomValue(atom);
    const [settledResult, setSettledResult] = useState(result);

    if (!AsyncResult.isInitial(result) && result !== settledResult) {
        setSettledResult(result);
    }

    return AsyncResult.isInitial(result) ? settledResult : result;
};
