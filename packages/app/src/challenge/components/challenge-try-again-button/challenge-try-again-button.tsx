import { Trans } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { GameContext } from '../../../game/context/game.context';
import { GameState, urlToGameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeFriendButtonStyles as styles } from '../challenge-friend-button/challenge-friend-button.styles';

interface Props {
    readonly gameState: GameState;
}
export const ChallengeTryAgainButton = ({ gameState }: Props) => {
    const { createFromState } = use(GameContext);
    const { theme } = use(ThemeContext);

    const handleTryAgain = () => {
        createFromState(urlToGameState(gameState.challengeState));
    };

    return (
        <BlackButton href="/game" onPress={handleTryAgain} replace style={styles.button}>
            <LucideRotateCcw color={theme.colors.white} size={16} style={styles.icon} />
            <Trans>Try Again</Trans>
        </BlackButton>
    );
};
