import { LucideSwords } from 'lucide-react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useShareChallenge } from '../../../game/hooks/use-share-challenge/use-share-challenge.hook';

import { ChallengeShareButtonStyles as styles } from './challenge-share-button.styles';

import type { GameState } from '../../../game/store/game.state';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly gameState: GameState;
    readonly style?: StyleProp<ViewStyle>;
    readonly text: string;
}

export const ChallengeShareButton = ({ gameState, style, text }: Props) => {
    const handlePress = useShareChallenge(gameState);
    const buttonStyles = [styles.button, style];

    return <BlackButton icon={LucideSwords} onPress={handlePress} style={buttonStyles} text={text}></BlackButton>;
};
