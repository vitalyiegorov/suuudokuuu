import { useAtomValue } from '@effect/atom-react/Hooks';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { currentRunAtom } from '../../../game/atoms/current-run.atom';
import { settingsAtom } from '../../../settings/atoms/settings.atom';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const BootGate = ({ children }: Props) => {
    const isSettingsLoaded = AsyncResult.isSuccess(useAtomValue(settingsAtom));
    const isCurrentRunLoaded = AsyncResult.isSuccess(useAtomValue(currentRunAtom));
    const isBooted = isSettingsLoaded && isCurrentRunLoaded;

    return isBooted ? children : null;
};
