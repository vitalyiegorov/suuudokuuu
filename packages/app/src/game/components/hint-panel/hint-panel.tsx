import { Trans, useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react-native';
import { use, useEffect } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { gameHintAction } from '../../store/game.actions';
import { HintStepNarration } from '../hint-step-narration/hint-step-narration';

import { HintPanelSelectors } from './hint-panel.selectors';
import { HintPanelStyles as styles } from './hint-panel.styles';

export const HintPanel = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);

    const dispatch = useAppDispatch();

    const { stepScript, stepIndex } = snapshot;
    const currentStep = stepScript?.steps[stepIndex];

    useEffect(() => () => void engine.stopStepScript(), [engine]);

    const handleBack = () => {
        engine.stepScriptBack();
    };

    const handleNext = () => {
        engine.stepScriptNext();
    };

    const handleApply = () => {
        if (isDefined(stepScript)) {
            dispatch(gameHintAction({ eliminations: stepScript.eliminations }));
            engine.applyStepScript();
        }
    };

    const handleDismiss = () => {
        engine.stopStepScript();
    };

    if (!isDefined(stepScript) || !isDefined(currentStep)) {
        return null;
    }

    const stepCount = stepScript.steps.length;
    const currentStepNumber = stepIndex + 1;
    const containerStyles = [styles.container, { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border }];
    const progressStyles = [styles.progress, { color: theme.colors.text.hint }];

    return (
        <View style={containerStyles} testID={HintPanelSelectors.Root}>
            <HintStepNarration step={currentStep} />

            <BlackText style={progressStyles} testID={HintPanelSelectors.Progress}>
                <Trans>
                    Step {currentStepNumber} of {stepCount}
                </Trans>
            </BlackText>

            <View style={styles.controls}>
                <View style={styles.stepControls}>
                    <AppButton
                        accessibilityLabel={t`Previous step`}
                        disabled={currentStepNumber === 1}
                        icon={LucideChevronLeft}
                        onPress={handleBack}
                        size="compact"
                        style={styles.stepButton}
                        testID={HintPanelSelectors.BackButton}
                        variant="inverted"
                    />

                    <AppButton
                        accessibilityLabel={t`Next step`}
                        disabled={currentStepNumber === stepCount}
                        icon={LucideChevronRight}
                        onPress={handleNext}
                        size="compact"
                        style={styles.stepButton}
                        testID={HintPanelSelectors.NextButton}
                        variant="inverted"
                    />
                </View>

                <View style={styles.actionControls}>
                    <AppButton
                        onPress={handleDismiss}
                        size="compact"
                        testID={HintPanelSelectors.DismissButton}
                        text={t`Dismiss`}
                        variant="inverted"
                    />

                    <AppButton onPress={handleApply} size="compact" testID={HintPanelSelectors.ApplyButton} text={t`Apply`} />
                </View>
            </View>
        </View>
    );
};
