import { useLingui } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { GameContext } from '../../../game/context/game.context';
import { GameState } from '../../../game/store/game.state';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';

import { ChallengeTryAgainButtonSelectors } from './challenge-try-again-button.selectors';

interface Props {
    readonly gameState: GameState;
}

export const ChallengeTryAgainButton = ({ gameState }: Props) => {
    const { createFromState, isCreatingGame } = use(GameContext);

    const { t } = useLingui();

    const handleTryAgain = () => {
        createFromState(stringToGameState(gameState.challengeState));
    };

    return (
        <AppLinkButton
            icon={LucideRotateCcw}
            isLoading={isCreatingGame}
            onPress={handleTryAgain}
            testID={ChallengeTryAgainButtonSelectors.Root}
            text={t`Try Again`}
        />
    );
};
