import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useResetGame } from '../@generic/hooks/use-reset-game.hook';
import { ChallengeResultScreen } from '../challenge/components/challenge-result-screen/challenge-result-screen';
import { ChallengeShareButton } from '../challenge/components/challenge-share-button/challenge-share-button';

export default function ChallengeWonPage() {
    const { t } = useLingui();

    const [, gameState] = useResetGame();

    return (
        <Page>
            <PageHeader title={t`Challenge Won!`} />

            <ChallengeResultScreen isWon={true} gameState={gameState}>
                <ChallengeShareButton gameState={gameState} text={t`Challenge Back`} />
            </ChallengeResultScreen>
        </Page>
    );
}
