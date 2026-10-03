import { useAtomValue } from '@effect/atom-react/Hooks';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { currentRunAtom } from '../../../game/query/use-current-run.query';
import { settingsAtom } from '../../../settings/query/use-settings.query';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const BootGate = ({ children }: Props) => {
    const isSettingsLoaded = AsyncResult.isSuccess(useAtomValue(settingsAtom));
    const isCurrentRunLoaded = AsyncResult.isSuccess(useAtomValue(currentRunAtom));

    return isSettingsLoaded && isCurrentRunLoaded ? children : null;
};
