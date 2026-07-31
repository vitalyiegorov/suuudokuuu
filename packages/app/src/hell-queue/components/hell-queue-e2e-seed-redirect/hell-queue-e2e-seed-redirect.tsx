import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { hellQueueRunE2eSeedEffect } from '../../utils/hell-queue-e2e-seed-effect.util';

export const HellQueueE2eSeedRedirect = () => {
    const dispatch = useAppDispatch();
    const { replace } = useRouter();

    useEffect(() => void hellQueueRunE2eSeedEffect({ dispatch, replace }), [dispatch, replace]);

    return null;
};
