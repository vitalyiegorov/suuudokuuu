import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useResetGame } from '../@generic/hooks/use-reset-game.hook';
import { ChallengeResultScreen } from '../challenge/components/challenge-result-screen/challenge-result-screen';
import { ChallengeShareButton } from '../challenge/components/challenge-share-button/challenge-share-button';
import { ChallengeResult } from '../challenge/interfaces/challenge-result.interface';
import { getChallengeResult } from '../challenge/utils/get-challenge-result.util';

export default function ChallengeWonPage() {
    const { t } = useLingui();

    const [, gameState] = useResetGame();
    const result = getChallengeResult(gameState.elapsedTime, gameState.challengeTime);
    const isWon = result === ChallengeResult.Won;

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Challenge Won!`} />

            <ChallengeResultScreen gameState={gameState}>
                {isWon && <ChallengeShareButton gameState={gameState} text={t`Challenge Back`} />}
            </ChallengeResultScreen>
        </Page>
    );
}
