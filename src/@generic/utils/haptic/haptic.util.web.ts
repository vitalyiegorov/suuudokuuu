import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics/src/Haptics.types';

// HINT: Temporary wrapper https://github.com/expo/expo/issues/19141
export const hapticNotification = (_type: NotificationFeedbackType = NotificationFeedbackType.Success) => void 0;

export const hapticImpact = (_style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium) => void 0;
