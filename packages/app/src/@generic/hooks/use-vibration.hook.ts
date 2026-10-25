import * as Effect from 'effect/Effect';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics';

import { useSettings } from '../../settings/query/use-settings.query';
import { appRuntime } from '../runtime/app.runtime';
import { logErrorCause } from '../utils/log-error-cause.util';

export const useVibration = (): [notification: (type: NotificationFeedbackType) => void, impact: (style: ImpactFeedbackStyle) => void] => {
    const { hasVibration } = useSettings();

    const hapticNotification = (type: NotificationFeedbackType = NotificationFeedbackType.Success) => {
        if (hasVibration) {
            appRuntime.runFork(Effect.tryPromise(() => Haptics.notificationAsync(type)).pipe(Effect.catchCause(logErrorCause)));
        }
    };

    const hapticImpact = (style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium) => {
        if (hasVibration) {
            appRuntime.runFork(Effect.tryPromise(() => Haptics.impactAsync(style)).pipe(Effect.catchCause(logErrorCause)));
        }
    };

    return [hapticNotification, hapticImpact] as const;
};
