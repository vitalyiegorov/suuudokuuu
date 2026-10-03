import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import { useScreenshotListener } from 'expo-screen-capture';

import { appRuntime } from '../../../@generic/runtime/app.runtime';

export const ChallengeScreenshotRecorder = () => {
    useScreenshotListener(
        () => void appRuntime.runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.screenshot))
    );

    return null;
};
