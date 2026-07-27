import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { LucideShare2 } from 'lucide-react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useShareGameState } from '../../hooks/use-share-game-state/use-share-game-state.hook';

interface Props {
    readonly text: string;
}

export const PuzzleShareButton = ({ text }: Props) => {
    const handlePress = useShareGameState(SharedPayloadKindEnum.Puzzle);

    return <BlackButton icon={LucideShare2} onPress={handlePress} text={text} />;
};
