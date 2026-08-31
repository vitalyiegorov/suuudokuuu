import { useLingui } from '@lingui/react/macro';
import { LucideUndo2 } from 'lucide-react-native';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { GameContext } from '../../context/game.context';
import { useGameHistoryControls } from '../../hooks/use-game-history-controls.hook';
import { gameIsChallengeRunSelector, gameMaxMistakesSelector } from '../../store/game.selectors';
import { GameHistoryButton } from '../game-history-button/game-history-button';

import { UndoButtonSelectors } from './undo-button.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const UndoButton = ({ sizeStyle }: Props) => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);

    const isChallengeRun = useAppSelector(gameIsChallengeRunSelector);
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const { handleUndo } = useGameHistoryControls(engine);

    const isDisabled = !snapshot.canUndo || isDefined(snapshot.stepScript) || snapshot.isWon;

    if (isChallengeRun || maxMistakes === 0) {
        return null;
    }

    return (
        <GameHistoryButton
            accessibilityLabel={t`Undo`}
            icon={LucideUndo2}
            isDisabled={isDisabled}
            onPress={handleUndo}
            sizeStyle={sizeStyle}
            testID={UndoButtonSelectors.Root}
        />
    );
};
