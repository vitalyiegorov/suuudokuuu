import { useLingui } from '@lingui/react/macro';
import LucideUndo2 from 'lucide-react-native/icons/undo-2';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { GameContext } from '../../context/game.context';
import { gameGetHistoryControls } from '../../utils/game-get-history-controls.util';
import { GameHistoryButton } from '../game-history-button/game-history-button';

import { UndoButtonSelectors } from './undo-button.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const UndoButton = ({ sizeStyle }: Props) => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);

    const { handleUndo } = gameGetHistoryControls(engine);

    const isDisabled = !snapshot.canUndo || isDefined(snapshot.stepScript) || snapshot.isWon;

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
