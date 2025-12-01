import { Trans, useLingui } from '@lingui/react/macro';

import { BlackText } from '../@generic/components/black-text/black-text';
import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { useResetGame } from '../@generic/hooks/use-reset-game.hook';
import { ChallengeResultScreen } from '../challenge/components/challenge-result-screen/challenge-result-screen';
import { TryAgainButton } from '../challenge/components/try-again-button/try-again-button';

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

                <TryAgainButton />
            </ChallengeResultScreen>
        </Page>
    );
}
