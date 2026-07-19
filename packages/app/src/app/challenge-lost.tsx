import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useResetGame } from '../@generic/hooks/use-reset-game.hook';
import { ChallengeResultScreen } from '../challenge/components/challenge-result-screen/challenge-result-screen';
import { ChallengeTryAgainButton } from '../challenge/components/challenge-try-again-button/challenge-try-again-button';

export default function ChallengeLostPage() {
    const { t } = useLingui();

    const [, gameState] = useResetGame();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Challenge Lost`} />

            <ChallengeResultScreen gameState={gameState}>
                <ChallengeTryAgainButton gameState={gameState} />
            </ChallengeResultScreen>
        </Page>
    );
}
