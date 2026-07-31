import { useEffect, useRef } from 'react';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { hellQueueRunRefillEffect } from '../../utils/hell-queue-refill-effect.util';

export const HellQueueRefillController = () => {
    const dispatch = useAppDispatch();
    const isRunningRef = useRef(false);
    const isCancelledRef = useRef(false);

    useEffect(() => hellQueueRunRefillEffect({ dispatch, isCancelledRef, isRunningRef }), [dispatch]);

    return null;
};
