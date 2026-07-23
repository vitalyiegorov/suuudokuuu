import { ScreenActionBar } from '../../../@generic/components/screen-action-bar/screen-action-bar';
import { ChallengeResultHomeButton } from '../challenge-result-home-button/challenge-result-home-button';
import { ChallengeResultReplayButton } from '../challenge-result-replay-button/challenge-result-replay-button';

import type { ReactNode } from 'react';

interface Props {
    readonly challengeState: string;
    readonly children: ReactNode;
}

export const ChallengeResultFooter = ({ challengeState, children }: Props) => (
    <ScreenActionBar left={<ChallengeResultReplayButton challengeState={challengeState} />} right={<ChallengeResultHomeButton />}>
        {children}
    </ScreenActionBar>
);
