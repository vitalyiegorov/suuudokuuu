import * as Effect from 'effect/Effect';
import { File } from 'expo-file-system';

export const settingsPickBackupFile = Effect.tryPromise(() => File.pickFileAsync({ mimeTypes: 'application/json' })).pipe(
    Effect.flatMap(picked => (picked.canceled ? Effect.succeedNone : Effect.tryPromise(() => picked.result.text()).pipe(Effect.asSome)))
);
