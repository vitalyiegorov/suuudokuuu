import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { runCurrentRunCommand } from '../utils/run-current-run-command.util';

import type { OnEventFn } from '@rnw-community/shared';

export const useResumeGame = (): OnEventFn => {
    const pathname = usePathname();
    const router = useRouter();
    const pathnameRef = useRef(pathname);

    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    return () =>
        void runCurrentRunCommand(currentRunService => currentRunService.resume).then(
            () => void (pathnameRef.current !== '/game' && router.replace('/game')),
            emptyFn
        );
};
