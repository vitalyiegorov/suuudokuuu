import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum, findHintStepScript } from '@suuudokuuu/field-core';
import { AppButton } from '@suuudokuuu/ui';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { GameContext } from '../../context/game.context';
import { gameStartHintStepScript } from '../../utils/game-start-hint-step-script.util';
import { runCurrentRunCommand } from '../../utils/run-current-run-command.util';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

export const HintPanelApplyButton = () => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);
    const { stepScript, stepIndex, hintLevel } = snapshot;
    const isWalkthrough = hintLevel === HintLevelEnum.WALKTHROUGH;
    const isEliminationOnly = !isDefined(stepScript?.placement);
    const placementValue = stepScript?.steps[stepIndex]?.narration.placement?.value;
    const placementText = isDefined(placementValue) ? t`Place ${placementValue}` : t`Apply`;
    const applyText = isEliminationOnly ? t`Apply & next` : placementText;
    const text = isWalkthrough ? applyText : t`Next ›`;
    const label = isWalkthrough ? text : t`Show more of the hint`;
    const applyTestId = isEliminationOnly ? HintPanelSelectors.ContinueButton : HintPanelSelectors.ApplyButton;
    const testId = isWalkthrough ? applyTestId : HintPanelSelectors.SHOW_MORE_BUTTON;

    const handleApply = () => {
        if (!isDefined(stepScript)) {
            return;
        }

        void runCurrentRunCommand(currentRunService => currentRunService.hint(stepScript.eliminations));
        engine.applyStepScript();

        if (isEliminationOnly) {
            const nextScript = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

            if (isDefined(nextScript)) {
                gameStartHintStepScript(engine, nextScript);
            }
        }
    };
    const handleNext = () => {
        if (engine.revealNextHintLevel()) {
            void runCurrentRunCommand(currentRunService => currentRunService.revealHintLevel());
        }
    };
    const onPress = isWalkthrough ? handleApply : handleNext;

    return (
        <AppButton
            accessibilityLabel={label}
            accessibilityRole="button"
            onPress={onPress}
            size="compact"
            style={styles.footerButton}
            testID={testId}
            text={text}
        />
    );
};
