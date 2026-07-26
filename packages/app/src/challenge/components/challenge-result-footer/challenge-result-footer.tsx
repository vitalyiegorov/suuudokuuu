import { ScreenActionBar } from '../../../@generic/components/screen-action-bar/screen-action-bar';
import { ChallengeResultHomeButton } from '../challenge-result-home-button/challenge-result-home-button';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ChallengeResultFooter = ({ children }: Props) => (
    <ScreenActionBar right={<ChallengeResultHomeButton />}>{children}</ScreenActionBar>
);
