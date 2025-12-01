import { useLingui } from '@lingui/react/macro';
import { LucideSwords } from 'lucide-react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useShare } from '../../../game/hooks/use-share.hook';

import { ChallengeFriendButtonStyles as styles } from './challenge-friend-button.styles';

import type { GameState } from '../../../game/store/game.state';

interface Props {
    readonly gameState: GameState;
}

export const ChallengeFriendButton = ({ gameState }: Props) => {
    const { t } = useLingui();

    const handlePress = useShare(gameState);

    return <BlackButton onPress={handlePress} style={styles.button} icon={LucideSwords} text={t`Challenge a Friend`}></BlackButton>;
};
