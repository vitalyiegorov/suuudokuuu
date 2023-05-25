import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics/src/Haptics.types';

// HINT: Temporary wrapper https://github.com/expo/expo/issues/19141
export const hapticNotification = async (type: NotificationFeedbackType = NotificationFeedbackType.Success) =>
    await Haptics.notificationAsync(type);

export const hapticImpact = async (style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium) => await Haptics.impactAsync(style);
