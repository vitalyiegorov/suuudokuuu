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
import { isChallengeRecording } from '../../../../challenge/utils/is-challenge-recording.util';
import { PuzzleShareButton } from '../../../../game/components/puzzle-share-button/puzzle-share-button';
import { GameContext } from '../../../../game/context/game.context';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { WinnerScreenSelectors } from '../winner-screen.selectors';

import { WinnerScreenActionsStyles as styles } from './winner-screen-actions.styles';

import type { GameSetupInterface } from '../../../../game/interface/game-setup.interface';
import type { GameState } from '../../../../game/store/game.state';

interface Props {
    readonly gameState: GameState;
    readonly retrySetup: GameSetupInterface;
}

export const WinnerScreenActions = ({ gameState, retrySetup }: Props) => {
    const { t } = useLingui();
    const { create, isCreatingGame } = use(GameContext);
    const { theme } = use(ThemeContext);

    const hasRival = isNotEmptyString(gameState.challengeState);
    const isChallengeShareable = isChallengeRecording(gameState);
    const isPuzzleShareable = !gameState.isChallengeRun && !hasRival;
    const handlePlayAgain = () => void create(retrySetup);
    const homeAction = <GameResultHomeButton accessibilityLabel={t`Home`} testID={WinnerScreenSelectors.HomeButton} />;

    if (isChallengeShareable || isPuzzleShareable) {
        const playAgainAction = (
            <GlassIconButton
                accessibilityLabel={t`Play again`}
                isLoading={isCreatingGame}
                onPress={handlePlayAgain}
                testID={WinnerScreenSelectors.PlayAgainButton}
            >
                <LucideRotateCcw color={theme.colors.inkText} />
            </GlassIconButton>
        );
        const shareAction = isChallengeShareable ? (
            <ChallengeShareButton gameState={gameState} text={t`Challenge`} />
        ) : (
            <PuzzleShareButton gameState={gameState} text={t`Share puzzle`} />
        );

        return (
            <ScreenActionBar left={playAgainAction} right={homeAction}>
                {shareAction}
            </ScreenActionBar>
        );
    }

    return (
        <GameResultActionsLayout homeAction={homeAction}>
            <PlayAgainButton isLoading={isCreatingGame} onPress={handlePlayAgain} style={styles.button} />
        </GameResultActionsLayout>
    );
};
