import * as Effect from 'effect/Effect';
import { launchCameraAsync } from 'expo-image-picker';

export const importScreenScanImage = Effect.tryPromise(() => launchCameraAsync({ mediaTypes: ['images'] })).pipe(
    Effect.map(result => (result.canceled ? null : result.assets[0].uri)),
    Effect.orDie
);
