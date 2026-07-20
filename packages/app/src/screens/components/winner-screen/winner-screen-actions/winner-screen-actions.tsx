import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { AppLinkButton } from '../../../../@generic/components/app-link-button/app-link-button';
import { GameResultActionsLayout } from '../../../../@generic/components/game-result-actions-layout/game-result-actions-layout';
import { PlayAgainButton } from '../../../../@generic/components/play-again-button/play-again-button';
import { ChallengeShareButton } from '../../../../challenge/components/challenge-share-button/challenge-share-button';
import { GameContext } from '../../../../game/context/game.context';

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
        <ChallengeShareButton gameState={gameState} style={styles.secondaryButton} text={t`Challenge`} />
    );
    const handlePlayAgain = () => void create(difficulty, gameState.maxMistakes);

    return (
        <GameResultActionsLayout>
            <PlayAgainButton onPress={handlePlayAgain} style={styles.playAgainButton} />

            <View style={styles.secondaryActions}>
                {challengeAction}
                <AppLinkButton href="/" replace size="regular" style={styles.secondaryButton} text={t`Home`} variant="ghost" />
            </View>
        </GameResultActionsLayout>
    );
};
