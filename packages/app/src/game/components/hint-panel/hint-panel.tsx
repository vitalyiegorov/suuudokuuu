import { HintLevelEnum } from '@suuudokuuu/field-core';
import { use } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isDefined } from '@rnw-community/shared';

import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { HintLevelNarration } from '../hint-level-narration/hint-level-narration';
import { HintPanelHeader } from '../hint-panel-header/hint-panel-header';
import { HintPanelStepControls } from '../hint-panel-step-controls/hint-panel-step-controls';
import { HintStepNarration } from '../hint-step-narration/hint-step-narration';

import { HintPanelSelectors } from './hint-panel.selectors';
import { HintPanelStyles as styles } from './hint-panel.styles';

const enterDurationMs = 180;
const exitDurationMs = 120;

interface Props {
    readonly controlsTop: number;
}

export const HintPanel = ({ controlsTop }: Props) => {
    const { theme } = use(ThemeContext);
    const { snapshot } = use(GameContext);

    const insets = useSafeAreaInsets();

    const isMotionReduced = useReduceMotion();

    const { stepScript, stepIndex } = snapshot;
    const currentStep = stepScript?.steps[stepIndex];

    if (!isDefined(stepScript) || !isDefined(currentStep)) {
        return null;
    }

    const containerStyles = [styles.container, { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border }];
    const isWalkthrough = snapshot.hintLevel === HintLevelEnum.WALKTHROUGH;
    const placementValue = currentStep.narration.placement?.value;
    const motionProps = isMotionReduced ? {} : { entering: FadeIn.duration(enterDurationMs), exiting: FadeOut.duration(exitDurationMs) };

    return (
        <Animated.View pointerEvents="box-none" style={styles.region(controlsTop, insets)} {...motionProps}>
            <View style={containerStyles} testID={HintPanelSelectors.Root}>
                <HintPanelHeader />
                {isWalkthrough ? (
                    <HintStepNarration stepIndex={stepIndex} stepScript={stepScript} value={placementValue} />
                ) : (
                    <HintLevelNarration hintLevel={snapshot.hintLevel} stepScript={stepScript} />
                )}

                <HintPanelStepControls />
            </View>
        </Animated.View>
    );
};
