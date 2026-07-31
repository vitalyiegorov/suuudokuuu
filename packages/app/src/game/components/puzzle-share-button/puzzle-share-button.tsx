import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { LucideShare2 } from 'lucide-react-native';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { useShareGameState } from '../../hooks/use-share-game-state/use-share-game-state.hook';

interface Props {
    readonly text: string;
}

export const PuzzleShareButton = ({ text }: Props) => {
    const handlePress = useShareGameState(SharedPayloadKindEnum.Puzzle);

    return <AppLinkButton icon={LucideShare2} onPress={handlePress} text={text} />;
};
