import { useLingui } from '@lingui/react/macro';
import LucideRotateCcw from 'lucide-react-native/icons/rotate-ccw';
import { use } from 'react';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { GameContext } from '../../../game/context/game.context';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';

import { ChallengeTryAgainButtonSelectors } from './challenge-try-again-button.selectors';

import type { CurrentRunType } from '@suuudokuuu/progress';

interface Props {
    readonly gameState: CurrentRunType;
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
