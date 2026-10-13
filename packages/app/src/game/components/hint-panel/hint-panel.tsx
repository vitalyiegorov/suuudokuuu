import { useLingui } from '@lingui/react/macro';
import { HintLevelEnum, buildStepScriptState } from '@suuudokuuu/field-core';
import { use } from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeIn, FadeInUp, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isDefined } from '@rnw-community/shared';

import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { HintLevelNarration } from '../hint-level-narration/hint-level-narration';
import { HintPanelApplyButton } from '../hint-panel-apply-button/hint-panel-apply-button';
import { HintPanelHeader } from '../hint-panel-header/hint-panel-header';
import { HintPanelShowAnswer } from '../hint-panel-show-answer/hint-panel-show-answer';
import { HintStepNarration } from '../hint-step-narration/hint-step-narration';
import { HintStepper } from '../hint-stepper/hint-stepper';

import { HintPanelSelectors } from './hint-panel.selectors';
import { HintPanelStyles as styles } from './hint-panel.styles';

const easeOutFirstControlX = 0.23;
const easeOutSecondControlX = 0.32;
const panelEaseOut = Easing.bezier(easeOutFirstControlX, 1, easeOutSecondControlX, 1);
const panelEnterOffset = 8;
const panelEnterDurationMs = 200;
const panelExitDurationMs = 150;
const panelResizeDurationMs = 200;
const pageFadeDurationMs = 150;

const panelEntering = FadeInUp.withInitialValues({ opacity: 0, transform: [{ translateY: panelEnterOffset }] })
    .duration(panelEnterDurationMs)
    .easing(panelEaseOut);
const panelReducedEntering = FadeIn.duration(pageFadeDurationMs);
const panelExiting = FadeOut.duration(panelExitDurationMs);
const panelLayout = LinearTransition.duration(panelResizeDurationMs).easing(panelEaseOut);
const pageEntering = FadeIn.duration(pageFadeDurationMs);

interface Props {
    readonly controlsTop: number;
}

export const HintPanel = ({ controlsTop }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { snapshot } = use(GameContext);

    const insets = useSafeAreaInsets();

    const isMotionReduced = useReduceMotion();

    const { stepScript, stepIndex, hintLevel, hintPageIndex, hintPageCount, revealedImplicationCount } = snapshot;
    const currentStep = stepScript?.steps[stepIndex];

    if (!isDefined(stepScript) || !isDefined(currentStep)) {
        return null;
    }

    const { hintRegion } = buildStepScriptState(stepScript, stepIndex, hintLevel, revealedImplicationCount);
    const containerStyles = [styles.container, { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border }];
    const isLastPage = hintPageIndex >= hintPageCount - 1;
    const isSinglePage = hintPageCount <= 1;
    const placementValue = isLastPage ? stepScript.placement?.value : null;
    const currentStepNumber = hintPageIndex + 1;
    const stepCount = hintPageCount;
    const stepLabel = t`Step ${currentStepNumber} of ${stepCount}`;
    const panelEnteringAnimation = isMotionReduced ? panelReducedEntering : panelEntering;

    return (
        <Animated.View
            entering={panelEnteringAnimation}
            exiting={panelExiting}
            pointerEvents="box-none"
            style={styles.region(controlsTop, insets)}
        >
            <Animated.View style={containerStyles} testID={HintPanelSelectors.Root} {...(!isMotionReduced && { layout: panelLayout })}>
                <HintPanelHeader />
                <Animated.View entering={pageEntering} key={hintPageIndex} style={styles.page}>
                    {hintLevel === HintLevelEnum.WALKTHROUGH ? (
                        <HintStepNarration revealedImplicationCount={revealedImplicationCount} step={currentStep} value={placementValue} />
                    ) : (
                        <HintLevelNarration hintLevel={hintLevel} hintRegion={hintRegion} stepScript={stepScript} />
                    )}
                    {isLastPage ? null : <HintPanelShowAnswer />}
                </Animated.View>
                {isSinglePage ? (
                    <View style={styles.actions} testID={HintPanelSelectors.FOOTER}>
                        <HintPanelApplyButton style={styles.footerButton} />
                    </View>
                ) : (
                    <HintStepper>{stepLabel}</HintStepper>
                )}
            </Animated.View>
        </Animated.View>
    );
};
