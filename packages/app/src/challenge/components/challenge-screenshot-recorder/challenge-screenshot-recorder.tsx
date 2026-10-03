import { useScreenshotListener } from 'expo-screen-capture';

import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';

export const ChallengeScreenshotRecorder = () => {
    useScreenshotListener(() => void runCurrentRunCommand(currentRunService => currentRunService.screenshot));

    return null;
};
