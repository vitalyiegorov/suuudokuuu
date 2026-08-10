import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { LucideShare2 } from 'lucide-react-native';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { useShareGameState } from '../../hooks/use-share-game-state/use-share-game-state.hook';

import type { GameState } from '../../store/game.state';

interface Props {
    readonly gameState: GameState;
    readonly testID?: string;
    readonly text: string;
}

export const PuzzleShareButton = ({ gameState, testID, text }: Props) => {
    const handlePress = useShareGameState(SharedPayloadKindEnum.Puzzle, gameState);

    return <AppLinkButton icon={LucideShare2} onPress={handlePress} testID={testID} text={text} />;
};
