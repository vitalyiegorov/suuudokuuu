import { useLingui } from '@lingui/react/macro';
import { useLocalSearchParams } from 'expo-router';

import { isDefined } from '@rnw-community/shared';

import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { useResetGame } from '../@generic/hooks/use-reset-game.hook';
import { ChallengeResultScreen } from '../challenge/components/challenge-result-screen/challenge-result-screen';
import { ChallengeTryAgainButton } from '../challenge/components/challenge-try-again-button/challenge-try-again-button';
import { ChallengeLossReason } from '../challenge/enums/challenge-loss-reason.enum';
import { ChallengeResult } from '../challenge/interfaces/challenge-result.interface';

export default function ChallengeLostPage() {
    const { t } = useLingui();
    const { reason } = useLocalSearchParams<{ reason?: string }>();

    const gameState = useResetGame();

    const lossReason = reason === ChallengeLossReason.Mistakes ? ChallengeLossReason.Mistakes : ChallengeLossReason.Time;

    if (!isDefined(gameState)) {
        return null;
    }

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead isNoIndex />
            <PageHeader title={t`Challenge Lost`} />

            <ChallengeResultScreen gameState={gameState} lossReason={lossReason} result={ChallengeResult.Lost}>
                <ChallengeTryAgainButton gameState={gameState} />
            </ChallengeResultScreen>
        </Page>
    );
}
