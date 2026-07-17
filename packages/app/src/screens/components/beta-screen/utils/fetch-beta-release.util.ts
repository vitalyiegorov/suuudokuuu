import { isDefined } from '@rnw-community/shared';

import { BetaReleaseApiUrl } from '../constant/beta-url.constant';
import { BetaReleaseSchema } from '../schema/beta-release.schema';

import type { BetaReleaseState } from '../types/beta-release-state.type';

type BetaReleaseFetchState = Exclude<BetaReleaseState, { readonly status: 'loading' }>;
const HttpOkStatus = 200;
const HttpNotFoundStatus = 404;

export const fetchBetaRelease = async (request: typeof fetch = fetch, signal?: AbortSignal): Promise<BetaReleaseFetchState> => {
    try {
        const response = await request(BetaReleaseApiUrl, { method: 'GET', ...(isDefined(signal) && { signal }) });

        if (response.status === HttpNotFoundStatus) {
            return { status: 'empty' };
        }

        if (response.status !== HttpOkStatus) {
            return { status: 'error' };
        }

        const body: unknown = await response.json();
        const parsedRelease = BetaReleaseSchema.safeParse(body);

        if (!parsedRelease.success) {
            return { status: 'error' };
        }

        return { release: parsedRelease.data, status: 'ready' };
    } catch {
        return { status: 'error' };
    }
};
