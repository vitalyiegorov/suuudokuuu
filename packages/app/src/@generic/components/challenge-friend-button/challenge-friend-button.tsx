import { Trans } from '@lingui/react/macro';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';

import { useShare } from '../../../game/hooks/use-share.hook';
import { GameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';
import { BlackButton } from '../black-button/black-button';

import { ChallengeFriendButtonStyles as styles } from './challenge-friend-button.styles';

interface Props {
    readonly gameState: GameState;
}
export const ChallengeFriendButton = ({ gameState }: Props) => {
    const { theme } = use(ThemeContext);

    const handlePress = useShare(gameState);

    return (
        <BlackButton onPress={handlePress} style={styles.button}>
            <LucideSwords color={theme.colors.white} size={16} style={styles.icon} />
            <Trans>Challenge a Friend</Trans>
        </BlackButton>
    );
};
