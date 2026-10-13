import { View } from 'react-native';

import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';
import { HintProgressDot } from '../hint-progress-dot/hint-progress-dot';

import type { StepScriptInterface } from '@suuudokuuu/field-core';

const maxProgressDots = 3;

interface Props {
    readonly stepIndex: number;
    readonly stepScript: StepScriptInterface;
}

export const HintProgress = ({ stepIndex, stepScript }: Props) => {
    const firstDotIndex = Math.max(0, Math.min(stepIndex - Math.floor(maxProgressDots / 2), stepScript.steps.length - maxProgressDots));

    return (
        <View style={styles.dots}>
            {stepScript.steps.slice(firstDotIndex, firstDotIndex + maxProgressDots).map((step, index) => {
                const dotStepIndex = index + firstDotIndex;

                return (
                    <HintProgressDot
                        currentStepIndex={stepIndex}
                        stepCount={stepScript.steps.length}
                        key={`${step.kind}-${dotStepIndex}`}
                        stepIndex={dotStepIndex}
                    />
                );
            })}
        </View>
    );
};
