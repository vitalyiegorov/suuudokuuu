import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import type { OnEventFn } from '@rnw-community/shared';

export const useAppStateChange = (onBackground: OnEventFn<void>, onActive?: OnEventFn<void>) => {
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                onActive?.();
            } else {
                onBackground();
            }
        });

        return () => void subscription.remove();
    }, [onActive, onBackground]);
};
