import { Trans } from '@lingui/react/macro';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useShare } from '../../../game/hooks/use-share.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeFriendButtonStyles as styles } from '../challenge-friend-button/challenge-friend-button.styles';

import type { GameState } from '../../../game/store/game.state';

interface Props {
    readonly gameState: GameState;
}

export const ChallengeBackButton = ({ gameState }: Props) => {
    const { theme } = use(ThemeContext);

    const handlePress = useShare(gameState);

    return (
        <BlackButton onPress={handlePress} style={styles.button}>
            <LucideSwords color={theme.colors.white} size={16} style={styles.icon} />
            <Trans>Challenge Back</Trans>
        </BlackButton>
    );
};
