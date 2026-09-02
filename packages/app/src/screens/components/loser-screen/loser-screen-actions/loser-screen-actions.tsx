import { useLingui } from '@lingui/react/macro';
import LucideRotateCcw from 'lucide-react-native/icons/rotate-ccw';
import { use } from 'react';

import { AppLinkButton } from '../../../../@generic/components/app-link-button/app-link-button';
import { GameResultActionsLayout } from '../../../../@generic/components/game-result-actions-layout/game-result-actions-layout';
import { GameResultHomeButton } from '../../../../@generic/components/game-result-home-button/game-result-home-button';
import { GameContext } from '../../../../game/context/game.context';
import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenActionsStyles as styles } from './loser-screen-actions.styles';

import type { GameSetupInterface } from '../../../../game/interface/game-setup.interface';

interface Props {
    readonly retrySetup: GameSetupInterface;
}

export const LoserScreenActions = ({ retrySetup }: Props) => {
    const { t } = useLingui();
    const { create, isCreatingGame } = use(GameContext);

    const handlePlayAgain = () => void create(retrySetup);
    const homeAction = <GameResultHomeButton accessibilityLabel={t`Home`} testID={LoserScreenSelectors.BackHomeButton} />;

    return (
        <GameResultActionsLayout homeAction={homeAction}>
            <AppLinkButton
                icon={LucideRotateCcw}
                isLoading={isCreatingGame}
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
