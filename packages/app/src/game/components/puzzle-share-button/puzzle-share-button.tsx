import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import LucideShare2 from 'lucide-react-native/icons/share-2';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { useShareGameState } from '../../hooks/use-share-game-state/use-share-game-state.hook';

import type { CurrentRunType } from '@suuudokuuu/progress';

interface Props {
    readonly gameState: CurrentRunType;
    readonly testID?: string;
    readonly text: string;
}

export const PuzzleShareButton = ({ gameState, testID, text }: Props) => {
    const handlePress = useShareGameState(SharedPayloadKindEnum.Puzzle, gameState);

    return <AppLinkButton icon={LucideShare2} onPress={handlePress} testID={testID} text={text} />;
};
