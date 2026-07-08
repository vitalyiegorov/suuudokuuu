import { LucideSwords } from 'lucide-react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useShareChallenge } from '../../../game/hooks/use-share-challenge/use-share-challenge.hook';

import { ChallengeShareButtonStyles as styles } from './challenge-share-button.styles';

import type { GameState } from '../../../game/store/game.state';

interface Props {
    readonly gameState: GameState;
    readonly text: string;
}

export const ChallengeShareButton = ({ gameState, text }: Props) => {
    const handlePress = useShareChallenge(gameState);

    return <BlackButton onPress={handlePress} style={styles.button} icon={LucideSwords} text={text}></BlackButton>;
};
