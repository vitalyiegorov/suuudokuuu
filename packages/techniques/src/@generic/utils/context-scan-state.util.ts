import { isDefined } from '@rnw-community/shared';

import { HypothesisPropagator } from '../classes/hypothesis-propagator/hypothesis-propagator';

import type { CandidateContext } from '../classes/candidate-context/candidate-context';

const propagatorsByContext = new WeakMap<CandidateContext, HypothesisPropagator>();
const searchCappedContexts = new WeakSet<CandidateContext>();

export const getContextHypothesisPropagator = (context: CandidateContext): HypothesisPropagator => {
    const cachedPropagator = propagatorsByContext.get(context);

    if (isDefined(cachedPropagator)) {
        return cachedPropagator;
    }

    const propagator = HypothesisPropagator.fromContext(context);

    propagatorsByContext.set(context, propagator);

    return propagator;
};

export const markContextSearchCapped = (context: CandidateContext): void => {
    searchCappedContexts.add(context);
};

export const wasContextSearchCapped = (context: CandidateContext): boolean => searchCappedContexts.has(context);
