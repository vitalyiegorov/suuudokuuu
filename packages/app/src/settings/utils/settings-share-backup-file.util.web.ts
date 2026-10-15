import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';

export const settingsShareBackupFile = (backup: string, fileName: string) =>
    Effect.acquireUseRelease(
        Effect.sync(() => window.URL.createObjectURL(new Blob([backup], { type: 'application/json' }))),
        url =>
            Effect.sync(() => {
                const link = document.createElement('a');

                link.href = url;
                link.download = fileName;
                link.click();
            }),
        url =>
            Effect.sync(() => {
                window.URL.revokeObjectURL(url);
            }).pipe(Effect.delay(Duration.minutes(1)))
    );
