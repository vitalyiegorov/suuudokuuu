import { useLingui } from '@lingui/react/macro';

import { ChallengeShareButton } from '../../../challenge/components/challenge-share-button/challenge-share-button';
import { PuzzleShareButton } from '../../../game/components/puzzle-share-button/puzzle-share-button';

import { ReplayShareActionSelectors } from './replay-share-action.selectors';

import type { GameState } from '../../../game/store/game.state';

interface Props {
    readonly gameState: GameState;
}

export const ReplayShareAction = ({ gameState }: Props) => {
    const { t } = useLingui();

    if (gameState.isChallengeRun) {
        return <ChallengeShareButton gameState={gameState} testID={ReplayShareActionSelectors.Button} text={t`Challenge`} />;
    }

    return <PuzzleShareButton gameState={gameState} testID={ReplayShareActionSelectors.Button} text={t`Share puzzle`} />;
};
