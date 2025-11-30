import { useLingui } from '@lingui/react/macro';
import { LucideHeartCrack } from 'lucide-react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChallengeResultScreen } from '../../../challenge/components/challenge-result-screen/challenge-result-screen';
import { ChallengeResultScreenStyles as styles } from '../../../challenge/components/challenge-result-screen/challenge-result-screen.styles';
import { TryAgainButton } from '../../../challenge/components/try-again-button/try-again-button';

import type { GameState } from '../../../game/store/game.state';

export const ChallengeLostScreen = () => {
    const { t } = useLingui();

    const extraContent = <BlackText style={styles.messageText}>{t`Better luck next time!`}</BlackText>;

    const renderActionButtons = (gameState: GameState) => <TryAgainButton gameState={gameState} />;

    return (
        <ChallengeResultScreen
            differenceLabel={t`slower`}
            extraContent={extraContent}
            headerText={t`Challenge lost!`}
            icon={LucideHeartCrack}
            isWon={false}
            renderActionButtons={renderActionButtons}
        />
    );
};
