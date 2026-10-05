import { useLingui } from '@lingui/react/macro';

import { isDefined } from '@rnw-community/shared';

import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { useResetGame } from '../@generic/hooks/use-reset-game.hook';
import { ChallengeResultScreen } from '../challenge/components/challenge-result-screen/challenge-result-screen';
import { ChallengeShareButton } from '../challenge/components/challenge-share-button/challenge-share-button';
import { ChallengeResult } from '../challenge/interfaces/challenge-result.interface';

export default function ChallengeWonPage() {
    const { t } = useLingui();

    const gameState = useResetGame();

    if (!isDefined(gameState)) {
        return null;
    }

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead isNoIndex />
            <PageHeader title={t`Challenge Won!`} />

            <ChallengeResultScreen gameState={gameState} result={ChallengeResult.Won}>
                <ChallengeShareButton gameState={gameState} text={t`Challenge Back`} />
            </ChallengeResultScreen>
        </Page>
    );
}
