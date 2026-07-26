import { ScreenActionBar } from '../screen-action-bar/screen-action-bar';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly homeAction: ReactNode;
}

export const GameResultActionsLayout = ({ children, homeAction }: Props): ReactNode => (
    <ScreenActionBar right={homeAction}>{children}</ScreenActionBar>
);
