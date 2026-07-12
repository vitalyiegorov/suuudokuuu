import { useLingui } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { GameContext } from '../../../game/context/game.context';
import { GameState } from '../../../game/store/game.state';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ChallengeShareButtonStyles as styles } from '../challenge-share-button/challenge-share-button.styles';

import { ChallengeTryAgainButtonSelectors } from './challenge-try-again-button.selectors';

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
            testID={ChallengeTryAgainButtonSelectors.Root}
            text={t`Try Again`}
            icon={LucideRotateCcw}
        ></BlackButton>
    );
};
