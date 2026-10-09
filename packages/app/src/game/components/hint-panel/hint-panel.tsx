import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum } from '@suuudokuuu/field-core';
import { AppButton } from '@suuudokuuu/ui';
import LucideX from 'lucide-react-native/icons/x';
import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { runCurrentRunCommand } from '../../utils/run-current-run-command.util';
import { HintLevelNarration } from '../hint-level-narration/hint-level-narration';
import { HintPanelEliminationActions } from '../hint-panel-elimination-actions/hint-panel-elimination-actions';
import { HintPanelStepControls } from '../hint-panel-step-controls/hint-panel-step-controls';
import { HintStepNarration } from '../hint-step-narration/hint-step-narration';

import { HintPanelSelectors } from './hint-panel.selectors';
import { HintPanelStyles as styles } from './hint-panel.styles';

const enterDurationMs = 180;
const exitDurationMs = 120;

interface Props {
    readonly availableHeight?: number;
}

export const HintPanel = ({ availableHeight }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);

    const isMotionReduced = useReduceMotion();

    const { stepScript, stepIndex } = snapshot;
    const currentStep = stepScript?.steps[stepIndex];

    useEffect(() => () => void engine.stopStepScript(), [engine]);

    const handleApply = () => {
        if (isDefined(stepScript)) {
            void runCurrentRunCommand(currentRunService => currentRunService.hint(stepScript.eliminations));
            engine.applyStepScript();
        }
    };

    const handleShowMore = () => {
        if (engine.revealNextHintLevel()) {
            void runCurrentRunCommand(currentRunService => currentRunService.revealHintLevel());
        }
    };

    const handleDismiss = () => {
        engine.stopStepScript();
    };

    if (!isDefined(stepScript) || !isDefined(currentStep)) {
        return null;
    }

    const isEliminationOnly = !isDefined(stepScript.placement);
    const containerStyles = [
        styles.container(availableHeight),
        { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border }
    ];
    const isWalkthrough = snapshot.hintLevel === HintLevelEnum.WALKTHROUGH;
    const isApplyShown = isWalkthrough && !isEliminationOnly;
    const areEliminationActionsShown = isWalkthrough && isEliminationOnly;
    const placementValue = currentStep.narration.placement?.value;
    const motionProps = isMotionReduced ? {} : { entering: FadeIn.duration(enterDurationMs), exiting: FadeOut.duration(exitDurationMs) };

    return (
        <Animated.View pointerEvents="box-none" style={styles.region(availableHeight)} {...motionProps}>
            <View style={containerStyles} testID={HintPanelSelectors.Root}>
                {isWalkthrough ? (
                    <HintStepNarration step={currentStep} value={placementValue} />
                ) : (
                    <HintLevelNarration hintLevel={snapshot.hintLevel} stepScript={stepScript} />
                )}

                <View style={styles.controls}>
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

                    {isWalkthrough ? (
                        <HintPanelStepControls engine={engine} stepIndex={stepIndex} stepScript={stepScript} />
                    ) : (
                        <AppButton
                            accessibilityLabel={t`Show more of the hint`}
                            onPress={handleShowMore}
                            size="compact"
                            testID={HintPanelSelectors.SHOW_MORE_BUTTON}
                            text={t`Show more`}
                            variant="ghost"
                        />
                    )}

                    {isApplyShown ? (
                        <AppButton onPress={handleApply} size="compact" testID={HintPanelSelectors.ApplyButton} text={t`Apply`} />
                    ) : null}
                </View>

                {areEliminationActionsShown ? (
                    <HintPanelEliminationActions engine={engine} onApply={handleApply} stepIndex={stepIndex} stepScript={stepScript} />
                ) : null}
            </View>
        </Animated.View>
    );
};
