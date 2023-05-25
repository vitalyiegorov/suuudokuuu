import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics/src/Haptics.types';

// HINT: Temporary wrapper https://github.com/expo/expo/issues/19141
export const hapticNotification = async (_type: NotificationFeedbackType = NotificationFeedbackType.Success) => void 0;

export const hapticImpact = async (_style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium) => void 0;
