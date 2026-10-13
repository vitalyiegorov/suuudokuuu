import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import LucideX from 'lucide-react-native/icons/x';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';
import { HintProgress } from '../hint-progress/hint-progress';
import { HintStepNarrationSelectors } from '../hint-step-narration/hint-step-narration.selectors';

export const HintPanelHeader = () => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);
    const { stepScript, stepIndex, hintLevel } = snapshot;
    const technique = hintLevel === HintLevelEnum.WALKTHROUGH ? stepScript?.steps[stepIndex]?.narration.technique : stepScript?.technique;

    if (!isDefined(technique) || !isDefined(stepScript)) {
        return null;
    }

    const techniqueName = technique === SolutionTechniqueEnum.Guess ? t`Reveal` : i18n._(techniqueLabelsConstant[technique]);
    const currentStepNumber = stepIndex + 1;
    const stepCount = stepScript.steps.length;
    const progressLabel = t`Step ${currentStepNumber} of ${stepCount}`;
    const handleDismiss = () => {
        engine.stopStepScript();
    };

    return (
        <View style={styles.header}>
            <BlackText numberOfLines={1} style={styles.technique} testID={HintStepNarrationSelectors.Technique}>
                {techniqueName}
            </BlackText>
            {hintLevel === HintLevelEnum.WALKTHROUGH ? (
                <View accessibilityLabel={progressLabel} testID={HintPanelSelectors.Progress}>
                    <HintProgress stepIndex={stepIndex} stepScript={stepScript} />
                </View>
            ) : null}
            <AppIconButton
                accessibilityLabel={t`Dismiss`}
                onPress={handleDismiss}
                size="compact"
                style={styles.dismissButton}
                testID={HintPanelSelectors.DismissButton}
                variant="ghost"
            >
                <LucideX color={theme.colors.text.primary} />
            </AppIconButton>
        </View>
    );
};
