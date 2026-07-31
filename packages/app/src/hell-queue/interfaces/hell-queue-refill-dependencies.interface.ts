import type { AppDispatch } from '../../@generic/app-root.store';
import type { RefObject } from 'react';

export interface HellQueueRefillDependenciesInterface {
    readonly dispatch: AppDispatch;
    readonly isRunningRef: RefObject<boolean>;
    readonly isCancelledRef: RefObject<boolean>;
}
