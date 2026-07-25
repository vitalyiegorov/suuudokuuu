import { useLingui } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { AppLinkButton } from '../../../../@generic/components/app-link-button/app-link-button';
import { GameResultActionsLayout } from '../../../../@generic/components/game-result-actions-layout/game-result-actions-layout';
import { GameResultHomeButton } from '../../../../@generic/components/game-result-home-button/game-result-home-button';
import { GameContext } from '../../../../game/context/game.context';
import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenActionsStyles as styles } from './loser-screen-actions.styles';

import type { GameState } from '../../../../game/store/game.state';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly gameState: GameState;
}

export const LoserScreenActions = ({ difficulty, gameState }: Props) => {
    const { t } = useLingui();
    const { create } = use(GameContext);

    const handlePlayAgain = () => void create(difficulty, gameState.maxMistakes);
    const homeAction = <GameResultHomeButton accessibilityLabel={t`Home`} testID={LoserScreenSelectors.BackHomeButton} />;

    return (
        <GameResultActionsLayout homeAction={homeAction}>
            <AppLinkButton
                icon={LucideRotateCcw}
                onPress={handlePlayAgain}
                size="large"
                style={styles.primaryButton}
                testID={LoserScreenSelectors.PlayAgainButton}
                text={t`Play again`}
                variant="primary"
            />
        </GameResultActionsLayout>
    );
};
