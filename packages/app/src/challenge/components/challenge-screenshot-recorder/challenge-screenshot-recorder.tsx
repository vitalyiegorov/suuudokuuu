import { useScreenshotListener } from 'expo-screen-capture';

import { emptyFn } from '@rnw-community/shared';

import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';

export const ChallengeScreenshotRecorder = () => {
    useScreenshotListener(() => void runCurrentRunCommand(currentRunService => currentRunService.screenshot).catch(emptyFn));

    return null;
};
