import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';

import { useSettings } from '../../settings/query/use-settings.query';

export const useVibration = (): [notification: (type: NotificationFeedbackType) => void, impact: (style: ImpactFeedbackStyle) => void] => {
    const { hasVibration } = useSettings();

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
