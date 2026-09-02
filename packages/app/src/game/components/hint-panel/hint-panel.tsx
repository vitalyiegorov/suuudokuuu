import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import LucideChevronLeft from 'lucide-react-native/icons/chevron-left';
import LucideChevronRight from 'lucide-react-native/icons/chevron-right';
import LucideX from 'lucide-react-native/icons/x';
import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { gameHintAction } from '../../store/game.actions';
import { HintStepNarration } from '../hint-step-narration/hint-step-narration';

import { HintPanelSelectors } from './hint-panel.selectors';
import { HintPanelStyles as styles } from './hint-panel.styles';

const enterDurationMs = 180;
const exitDurationMs = 120;

interface Props {
    readonly narrationLineCount: number;
    readonly surfaceHeight: number;
}

export const HintPanel = ({ narrationLineCount, surfaceHeight }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);

    const isMotionReduced = useReduceMotion();

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
    const containerStyles = [
        styles.container(surfaceHeight),
        { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border }
    ];
    const progressAccessibilityLabel = t`Step ${currentStepNumber} of ${stepCount}`;
    const placementValue = stepScript.placement?.value;
    const dismissIconColor = theme.colors.text.primary;
    const motionProps = isMotionReduced ? {} : { entering: FadeIn.duration(enterDurationMs), exiting: FadeOut.duration(exitDurationMs) };

    return (
        <Animated.View style={containerStyles} testID={HintPanelSelectors.Root} {...motionProps}>
            <HintStepNarration lineCount={narrationLineCount} step={currentStep} value={placementValue} />

            <View style={styles.controls}>
                <AppIconButton
                    accessibilityLabel={t`Dismiss`}
                    onPress={handleDismiss}
                    size="compact"
                    style={styles.dismissButton}
                    testID={HintPanelSelectors.DismissButton}
                    variant="ghost"
                >
                    <LucideX color={dismissIconColor} />
                </AppIconButton>

                <View accessibilityLabel={progressAccessibilityLabel} style={styles.stepControls} testID={HintPanelSelectors.Progress}>
                    <AppButton
                        accessibilityLabel={t`Previous step`}
                        disabled={currentStepNumber === 1}
                        icon={LucideChevronLeft}
                        onPress={handleBack}
                        size="compact"
                        style={styles.stepButton}
                        testID={HintPanelSelectors.BackButton}
                        variant="ghost"
                    />

                    <View style={styles.dots}>
                        {stepScript.steps.map((step, index) => {
                            const isCurrentStep = index === stepIndex;
                            const dotStyles = isCurrentStep ? styles.dotActive : styles.dot;

                            return <View key={`${step.kind}-${index}`} style={dotStyles} />;
                        })}
                    </View>

                    <AppButton
                        accessibilityLabel={t`Next step`}
                        disabled={currentStepNumber === stepCount}
                        icon={LucideChevronRight}
                        onPress={handleNext}
                        size="compact"
                        style={styles.stepButton}
                        testID={HintPanelSelectors.NextButton}
                        variant="ghost"
                    />
                </View>

                <AppButton onPress={handleApply} size="compact" testID={HintPanelSelectors.ApplyButton} text={t`Apply`} />
            </View>
        </Animated.View>
    );
};
