import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

import { SystemMotionContext } from './context/system-motion.context';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const SystemMotionProvider = ({ children }: Props) => {
    const [isSystemMotionReduced, setIsSystemMotionReduced] = useState(false);

    useEffect(() => {
        let isSubscribed = true;

        const applyInitialValue = (isEnabled: boolean) => {
            if (isSubscribed) {
                setIsSystemMotionReduced(isEnabled);
            }
        };

        AccessibilityInfo.isReduceMotionEnabled()
            .then(isEnabled => void applyInitialValue(isEnabled))
            .catch(() => void applyInitialValue(false));

        const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setIsSystemMotionReduced);

        return () => {
            isSubscribed = false;
            subscription.remove();
        };
    }, []);

    return <SystemMotionContext value={isSystemMotionReduced}>{children}</SystemMotionContext>;
};
