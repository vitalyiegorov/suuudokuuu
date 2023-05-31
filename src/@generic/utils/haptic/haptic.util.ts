import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics/src/Haptics.types';

// HINT: Temporary wrapper https://github.com/expo/expo/issues/19141
export const hapticNotification = (type: NotificationFeedbackType = NotificationFeedbackType.Success) =>
    void Haptics.notificationAsync(type);

export const hapticImpact = (style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium) => void Haptics.impactAsync(style);
