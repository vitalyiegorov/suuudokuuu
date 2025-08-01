import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics/src/Haptics.types';

import { useAppSelector } from './use-app-selector.hook';

export const useVibration = (): [notification: (type: NotificationFeedbackType) => void, impact: (style: ImpactFeedbackStyle) => void] => {
    const { hasVibration } = useAppSelector(state => state.settings);

    const hapticNotification = (type: NotificationFeedbackType = NotificationFeedbackType.Success) => {
        if (hasVibration) {
            void Haptics.notificationAsync(type);
        }
    };

    const hapticImpact = (style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium) => {
        if (hasVibration) {
            void Haptics.impactAsync(style);
        }
    };

    return [hapticNotification, hapticImpact] as const;
};
