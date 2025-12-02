import { Trans, useLingui } from '@lingui/react/macro';

import { BlackText } from '../@generic/components/black-text/black-text';
import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useResetGame } from '../@generic/hooks/use-reset-game.hook';
import { ChallengeResultScreen } from '../challenge/components/challenge-result-screen/challenge-result-screen';
import { ChallengeTryAgainButton } from '../challenge/components/challenge-try-again-button/challenge-try-again-button';

export default function ChallengeLostPage() {
    const { t } = useLingui();

    const [, gameState] = useResetGame();

    return (
        <Page>
            <PageHeader title={t`Challenge Lost`} />

            <ChallengeResultScreen gameState={gameState} isWon={false}>
                <BlackText>
                    <Trans>Better luck next time!</Trans>
                </BlackText>

                <ChallengeTryAgainButton gameState={gameState} />
            </ChallengeResultScreen>
        </Page>
    );
}
