import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import { useRouter } from 'expo-router';

import { appRuntime } from '../../../../@generic/runtime/app.runtime';
import { gameScreenOpenSettings } from '../utils/game-screen-open-settings.util';

export const useOpenGameSettings = (): (() => void) => {
    const router = useRouter();

    return () =>
        void gameScreenOpenSettings(
            () => void appRuntime.runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.pause(false))),
            href => void router.push(href)
        );
};
