import { useLingui } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { GameResultActionsLayout } from '../../../../@generic/components/game-result-actions-layout/game-result-actions-layout';
import { GameResultHomeButton } from '../../../../@generic/components/game-result-home-button/game-result-home-button';
import { GlassIconButton } from '../../../../@generic/components/glass-icon-button/glass-icon-button';
import { PlayAgainButton } from '../../../../@generic/components/play-again-button/play-again-button';
import { ScreenActionBar } from '../../../../@generic/components/screen-action-bar/screen-action-bar';
import { ChallengeShareButton } from '../../../../challenge/components/challenge-share-button/challenge-share-button';
import { GameContext } from '../../../../game/context/game.context';
import { ThemeContext } from '../../../../theme/context/theme.context';
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
    const { theme } = use(ThemeContext);

    const isChallengeShareable = !isNotEmptyString(gameState.challengeState);
    const handlePlayAgain = () => void create(difficulty, gameState.maxMistakes);
    const homeAction = <GameResultHomeButton accessibilityLabel={t`Home`} testID={WinnerScreenSelectors.HomeButton} />;

    if (isChallengeShareable) {
        const playAgainAction = (
            <GlassIconButton accessibilityLabel={t`Play again`} onPress={handlePlayAgain} testID={WinnerScreenSelectors.PlayAgainButton}>
                <LucideRotateCcw color={theme.colors.label.inverted} />
            </GlassIconButton>
        );

        return (
            <ScreenActionBar left={playAgainAction} right={homeAction}>
                <ChallengeShareButton gameState={gameState} text={t`Challenge`} />
            </ScreenActionBar>
        );
    }

    return (
        <GameResultActionsLayout homeAction={homeAction}>
            <PlayAgainButton onPress={handlePlayAgain} style={styles.button} />
        </GameResultActionsLayout>
    );
};
