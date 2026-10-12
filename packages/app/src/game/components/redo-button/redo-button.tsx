import { useLingui } from '@lingui/react/macro';
import LucideRedo2 from 'lucide-react-native/icons/redo-2';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { GameContext } from '../../context/game.context';
import { gameGetHistoryControls } from '../../utils/game-get-history-controls.util';
import { GameHistoryButton } from '../game-history-button/game-history-button';

import { RedoButtonSelectors } from './redo-button.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const RedoButton = ({ sizeStyle }: Props) => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);

    const { handleRedo } = gameGetHistoryControls(engine);

    const isDisabled = !snapshot.canRedo || isDefined(snapshot.stepScript) || snapshot.isWon;

    return (
        <GameHistoryButton
            accessibilityLabel={t`Redo`}
            icon={LucideRedo2}
            isDisabled={isDisabled}
            onPress={handleRedo}
            sizeStyle={sizeStyle}
            testID={RedoButtonSelectors.Root}
        />
    );
};
