import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import { isDefined } from '@rnw-community/shared';

export const settingsPickBackupFile = Effect.callback<Option.Option<string>>(resume => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
        const file = input.files?.item(0);

        resume(isDefined(file) ? Effect.promise(() => file.text()).pipe(Effect.map(Option.some)) : Effect.succeedNone);
    });
    input.addEventListener('cancel', () => {
        resume(Effect.succeedNone);
    });
    input.click();
});
