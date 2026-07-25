import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { GameResultActionsLayout } from '../../../../@generic/components/game-result-actions-layout/game-result-actions-layout';
import { GameResultHomeButton } from '../../../../@generic/components/game-result-home-button/game-result-home-button';
import { PlayAgainButton } from '../../../../@generic/components/play-again-button/play-again-button';
import { ChallengeShareButton } from '../../../../challenge/components/challenge-share-button/challenge-share-button';
import { GameContext } from '../../../../game/context/game.context';
import { WinnerScreenSelectors } from '../winner-screen.selectors';

import { WinnerScreenActionsStyles as styles } from './winner-screen-actions.styles';

import type { GameState } from '../../../../game/store/game.state';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly gameState: GameState;
}

export const WinnerScreenActions = ({ difficulty, gameState }: Props) => {
    const { t } = useLingui();
    const { create } = use(GameContext);
    const challengeAction = isNotEmptyString(gameState.challengeState) ? null : (
        <ChallengeShareButton gameState={gameState} style={styles.button} text={t`Challenge`} />
    );
    const handlePlayAgain = () => void create(difficulty, gameState.maxMistakes);
    const homeAction = <GameResultHomeButton accessibilityLabel={t`Home`} testID={WinnerScreenSelectors.HomeButton} />;

    return (
        <GameResultActionsLayout homeAction={homeAction}>
            <View style={styles.actionsRow}>
                <PlayAgainButton onPress={handlePlayAgain} style={styles.button} />
                {challengeAction}
            </View>
        </GameResultActionsLayout>
    );
};
