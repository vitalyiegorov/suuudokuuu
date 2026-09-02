import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import LucideShare2 from 'lucide-react-native/icons/share-2';
import LucideSwords from 'lucide-react-native/icons/swords';
import { use } from 'react';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { useShareChallenge } from '../../../game/hooks/use-share-challenge/use-share-challenge.hook';
import { useShareGameState } from '../../../game/hooks/use-share-game-state/use-share-game-state.hook';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayShareActionSelectors } from './replay-share-action.selectors';
import { ReplayShareActionStyles as styles } from './replay-share-action.styles';

import type { GameState } from '../../../game/store/game.state';

const ShareIconSize = 22;

interface Props {
    readonly gameState: GameState;
}

export const ReplayShareAction = ({ gameState }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const handleShareChallenge = useShareChallenge(gameState);
    const handleSharePuzzle = useShareGameState(SharedPayloadKindEnum.Puzzle, gameState);

    const { isChallengeRun } = gameState;
    const handlePress = isChallengeRun ? handleShareChallenge : handleSharePuzzle;
    const accessibilityLabel = isChallengeRun ? t`Challenge` : t`Share puzzle`;
    const ShareIcon = isChallengeRun ? LucideSwords : LucideShare2;
    const iconColor = theme.colors.surface.raisedText;

    return (
        <AppIconButton
            accessibilityLabel={accessibilityLabel}
            onPress={handlePress}
            style={styles.button}
            testID={ReplayShareActionSelectors.Button}
            variant="inverted"
        >
            <ShareIcon color={iconColor} size={ShareIconSize} />
        </AppIconButton>
    );
};
