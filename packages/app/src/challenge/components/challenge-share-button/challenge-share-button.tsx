import { LucideSwords } from 'lucide-react-native';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { useShareChallenge } from '../../../game/hooks/use-share-challenge/use-share-challenge.hook';

import type { GameState } from '../../../game/store/game.state';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly gameState: GameState;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly text: string;
}

export const ChallengeShareButton = ({ gameState, style, testID, text }: Props) => {
    const handlePress = useShareChallenge(gameState);

    return <AppLinkButton icon={LucideSwords} onPress={handlePress} style={style} testID={testID} text={text} />;
};
