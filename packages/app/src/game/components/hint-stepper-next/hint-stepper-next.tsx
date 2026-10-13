import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum } from '@suuudokuuu/field-core';
import { AppButton } from '@suuudokuuu/ui';
import { use } from 'react';

import { GameContext } from '../../context/game.context';
import { runCurrentRunCommand } from '../../utils/run-current-run-command.util';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

export const HintStepperNext = () => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);
    const isRevealingLevel = snapshot.hintLevel !== HintLevelEnum.WALKTHROUGH;

    const handleNext = () => {
        if (engine.hintNext()) {
            void runCurrentRunCommand(currentRunService => currentRunService.revealHintLevel());
        }
    };

    return (
        <AppButton
            accessibilityRole="button"
            onPress={handleNext}
            size="compact"
            style={styles.stepperButton}
            testID={HintPanelSelectors.NextButton}
            text={t`Next ›`}
            {...(isRevealingLevel && { accessibilityHint: t`Reveals more of the hint` })}
        />
    );
};
