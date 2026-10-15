import * as Effect from 'effect/Effect';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const settingsShareBackupFile = Effect.fn('settingsShareBackupFile')(function* (backup: string, fileName: string) {
    const file = new File(Paths.cache, fileName);

    yield* Effect.try(() => {
        file.create({ overwrite: true });
    });
    yield* Effect.tryPromise(() => file.write(backup));
    yield* Effect.tryPromise(() => Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json' }));
});
