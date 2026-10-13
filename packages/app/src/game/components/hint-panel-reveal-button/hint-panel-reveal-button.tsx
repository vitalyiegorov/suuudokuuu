import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum, findRevealStepScript } from '@suuudokuuu/field-core';
import { AppButton } from '@suuudokuuu/ui';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { GameContext } from '../../context/game.context';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

export const HintPanelRevealButton = () => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);
    const { hintLevel } = snapshot;
    const isWalkthrough = hintLevel === HintLevelEnum.WALKTHROUGH;
    const text = isWalkthrough ? t`Reveal` : t`‹ Back`;
    const testId = isWalkthrough ? HintPanelSelectors.RevealButton : HintPanelSelectors.BackButton;
    const buttonStyles = [styles.footerButton, !isWalkthrough && styles.disabledButton];

    const handleReveal = () => {
        const revealScript = findRevealStepScript(engine.Sudoku);

        if (isDefined(revealScript)) {
            engine.startStepScript(revealScript);
        }
    };

    return (
        <AppButton
            accessibilityRole="button"
            disabled={!isWalkthrough}
            onPress={handleReveal}
            size="compact"
            style={buttonStyles}
            testID={testId}
            text={text}
            variant="ghost"
        />
    );
};
