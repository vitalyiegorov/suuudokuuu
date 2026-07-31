import { getIsE2eSeedingEnabled } from '../../@generic/utils/get-is-e2e-seeding-enabled.util';
import { HellQueueE2eSeedEntry } from '../constants/hell-queue-e2e-seed-entry.constant';
import { hellQueueEnqueueAction } from '../store/hell-queue.actions';

import type { AppDispatch } from '../../@generic/app-root.store';

interface HellQueueE2eSeedEffectDependenciesInterface {
    readonly dispatch: AppDispatch;
    readonly replace: (href: '/') => void;
}

export const hellQueueRunE2eSeedEffect = (dependencies: HellQueueE2eSeedEffectDependenciesInterface): void => {
    const { dispatch, replace } = dependencies;

    if (getIsE2eSeedingEnabled()) {
        dispatch(hellQueueEnqueueAction(HellQueueE2eSeedEntry));
    }

    replace('/');
};
