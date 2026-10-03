import { usePathname, useRouter } from 'expo-router';

import { gameResumeGetNavigationIntent } from '../utils/game-resume-get-navigation-intent.util';
import { runCurrentRunCommand } from '../utils/run-current-run-command.util';

import type { OnEventFn } from '@rnw-community/shared';

export const useResumeGame = (): OnEventFn => {
    const pathname = usePathname();
    const router = useRouter();

    return () => {
        const navigationIntent = gameResumeGetNavigationIntent(pathname);

        const shouldReplaceRoute = navigationIntent === 'replace';

        void runCurrentRunCommand(currentRunService => currentRunService.resume).then(
            () => void (shouldReplaceRoute && router.replace('/game'))
        );
    };
};
