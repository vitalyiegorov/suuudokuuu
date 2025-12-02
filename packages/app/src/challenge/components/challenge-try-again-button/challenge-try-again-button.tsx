import { useLingui } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { GameContext } from '../../../game/context/game.context';
import { GameState } from '../../../game/store/game.state';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ChallengeFriendButtonStyles as styles } from '../challenge-friend-button/challenge-friend-button.styles';

interface Props {
    readonly gameState: GameState;
}

export const ChallengeTryAgainButton = ({ gameState }: Props) => {
    const { createFromState } = use(GameContext);

    const { t } = useLingui();

    const handleTryAgain = () => {
        createFromState(stringToGameState(gameState.challengeState));
    };

    return (
        <BlackButton
            href="/game"
            onPress={handleTryAgain}
            replace
            style={styles.button}
            text={t`Try Again`}
            icon={LucideRotateCcw}
        ></BlackButton>
    );
};
