import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { GlassIconButton } from '../../../@generic/components/glass-icon-button/glass-icon-button';
import { GameContext } from '../../../game/context/game.context';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResultFooterSelectors } from '../challenge-result-footer/challenge-result-footer.selectors';

interface Props {
    readonly challengeState: string;
}

export const ChallengeResultReplayButton = ({ challengeState }: Props) => {
    const { createFromState } = use(GameContext);
    const { theme } = use(ThemeContext);

    const handleReplay = () => {
        createFromState(stringToGameState(challengeState));
    };

    return (
        <GlassIconButton href="/game" onPress={handleReplay} replace testID={ChallengeResultFooterSelectors.ReplayButton}>
            <LucideRotateCcw color={theme.colors.label.inverted} />
        </GlassIconButton>
    );
};
