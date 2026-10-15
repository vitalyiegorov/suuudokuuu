import * as Effect from 'effect/Effect';

export const settingsShareBackupFile = (backup: string, fileName: string) =>
    Effect.sync(() => {
        const link = document.createElement('a');

        link.href = `data:application/json;charset=utf-8,${encodeURIComponent(backup)}`;
        link.download = fileName;
        link.click();
    });
