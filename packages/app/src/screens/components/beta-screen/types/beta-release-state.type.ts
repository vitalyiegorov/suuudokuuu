import type { BetaRelease } from '../schema/beta-release.schema';

export type BetaReleaseState =
    | { readonly status: 'loading' }
    | { readonly status: 'ready'; readonly release: BetaRelease }
    | { readonly status: 'empty' }
    | { readonly status: 'error' };
