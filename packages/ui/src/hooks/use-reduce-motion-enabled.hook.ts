import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const useReduceMotionEnabled = (): boolean => {
    const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

    useEffect(() => {
        const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setIsReduceMotionEnabled);

        AccessibilityInfo.isReduceMotionEnabled()
            .then(setIsReduceMotionEnabled)
            .catch(() => void setIsReduceMotionEnabled(false));

        return () => {
            subscription.remove();
        };
    }, []);

    return isReduceMotionEnabled;
};
