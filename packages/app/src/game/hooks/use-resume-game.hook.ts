import { usePathname, useRouter } from 'expo-router';

import { runCurrentRunCommand } from '../utils/run-current-run-command.util';

import type { OnEventFn } from '@rnw-community/shared';

export const useResumeGame = (): OnEventFn => {
    const pathname = usePathname();
    const router = useRouter();
    const shouldReplaceRoute = pathname !== '/game';

    return () =>
        void runCurrentRunCommand(currentRunService => currentRunService.resume).then(
            () => void (shouldReplaceRoute && router.replace('/game'))
        );
};
