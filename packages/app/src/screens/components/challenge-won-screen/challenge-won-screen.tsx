import { useLingui } from '@lingui/react/macro';
import { LucideTrophy } from 'lucide-react-native';

import { ChallengeBackButton } from '../../../challenge/components/challenge-back-button/challenge-back-button';
import { ChallengeResultScreen } from '../../../challenge/components/challenge-result-screen/challenge-result-screen';

import type { GameState } from '../../../game/store/game.state';

export const ChallengeWonScreen = () => {
    const { t } = useLingui();

    const renderActionButtons = (gameState: GameState) => <ChallengeBackButton gameState={gameState} />;

    return (
        <ChallengeResultScreen
            differenceLabel={t`faster!`}
            headerText={t`You won the challenge!`}
            icon={LucideTrophy}
            isWon={true}
            renderActionButtons={renderActionButtons}
        />
    );
};
