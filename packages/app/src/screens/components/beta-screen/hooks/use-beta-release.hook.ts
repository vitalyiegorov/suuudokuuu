import { useAtomRefresh, useAtomValue } from '@effect/atom-react/Hooks';
import * as Effect from 'effect/Effect';
import * as FetchHttpClient from 'effect/http/FetchHttpClient';
import * as HttpClient from 'effect/http/HttpClient';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import * as Atom from 'effect/reactivity/Atom';
import * as Schema from 'effect/Schema';

import { logErrorCause } from '../../../../@generic/utils/log-error-cause.util';
import { BetaReleaseApiUrl } from '../constant/beta-url.constant';
import { BetaReleaseSchema } from '../schema/beta-release.schema';

import type { BetaReleaseState } from '../types/beta-release-state.type';

const HttpOkStatus = 200;
const HttpNotFoundStatus = 404;

const fetchBetaRelease = Effect.gen(function* () {
    const response = yield* HttpClient.get(BetaReleaseApiUrl);

    if (response.status === HttpNotFoundStatus) {
        return { status: 'empty' } as const;
    }

    if (response.status !== HttpOkStatus) {
        return { status: 'error' } as const;
    }

    const body = yield* response.json;
    const release = yield* Schema.decodeUnknownEffect(BetaReleaseSchema)(body, { onExcessProperty: 'error' });

    return { release, status: 'ready' } as const;
}).pipe(
    Effect.tapCause(logErrorCause),
    Effect.catch(() => Effect.succeed<BetaReleaseState>({ status: 'error' }))
);

const betaReleaseAtom = Atom.make(fetchBetaRelease.pipe(Effect.provide(FetchHttpClient.layer)));

export const useBetaRelease = () => {
    const result = useAtomValue(betaReleaseAtom);
    const retry = useAtomRefresh(betaReleaseAtom);
    const state: BetaReleaseState = AsyncResult.isSuccess(result) && !result.waiting ? result.value : { status: 'loading' };

    return { retry, state };
};
