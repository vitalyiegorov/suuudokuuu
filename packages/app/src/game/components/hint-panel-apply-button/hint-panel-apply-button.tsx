import { useLingui } from '@lingui/react/macro';
import { findHintStepScript } from '@suuudokuuu/field-core';
import { AppButton } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { GameContext } from '../../context/game.context';
import { gameStartHintStepScript } from '../../utils/game-start-hint-step-script.util';
import { runCurrentRunCommand } from '../../utils/run-current-run-command.util';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly style: StyleProp<ViewStyle>;
}

export const HintPanelApplyButton = ({ style }: Props) => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);
    const [, hapticImpact] = useVibration();

    const { stepScript } = snapshot;
    const placementValue = stepScript?.placement?.value;
    const isEliminationOnly = !isDefined(placementValue);
    const text = isEliminationOnly ? t`Apply & next` : t`Place ${placementValue}`;
    const testId = isEliminationOnly ? HintPanelSelectors.ContinueButton : HintPanelSelectors.ApplyButton;

    const handleApply = () => {
        if (!isDefined(stepScript)) {
            return;
        }

        if (!isEliminationOnly) {
            hapticImpact(ImpactFeedbackStyle.Light);
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

    return <AppButton accessibilityRole="button" onPress={handleApply} size="compact" style={style} testID={testId} text={text} />;
};
