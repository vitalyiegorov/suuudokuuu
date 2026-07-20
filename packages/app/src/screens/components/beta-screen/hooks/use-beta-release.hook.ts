import { useEffect, useState } from 'react';

import { fetchBetaRelease } from '../utils/fetch-beta-release.util';

import type { BetaReleaseState } from '../types/beta-release-state.type';

export const useBetaRelease = () => {
    const [state, setState] = useState<BetaReleaseState>({ status: 'loading' });
    const [requestVersion, setRequestVersion] = useState(0);

    const retry = () => {
        setState({ status: 'loading' });
        setRequestVersion(version => version + 1);
    };

    useEffect(() => {
        const abortController = new AbortController();
        const handleSuccess = (nextState: BetaReleaseState) => {
            if (!abortController.signal.aborted) {
                setState(nextState);
            }
        };
        const handleError = () => {
            if (!abortController.signal.aborted) {
                setState({ status: 'error' });
            }
        };

        fetchBetaRelease(fetch, abortController.signal).then(handleSuccess).catch(handleError);

        return () => {
            abortController.abort();
        };
    }, [requestVersion]);

    return { retry, state };
};
