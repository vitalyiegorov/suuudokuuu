import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { GameContext } from '../../context/game.context';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

interface Props {
    readonly stepIndex: number;
    readonly currentStepIndex: number;
    readonly stepCount: number;
}

export const HintProgressDot = ({ stepIndex, currentStepIndex, stepCount }: Props) => {
    const { t } = useLingui();
    const { engine } = use(GameContext);
    const isSelected = stepIndex === currentStepIndex;
    const accessibilityState = { selected: isSelected };
    const dotStyles = isSelected ? styles.dotActive : styles.dot;
    const currentStepNumber = stepIndex + 1;
    const label = t`Step ${currentStepNumber} of ${stepCount}`;
    const adjacentTestId = stepIndex < currentStepIndex ? HintPanelSelectors.BackButton : HintPanelSelectors.NextButton;
    const testId = Math.abs(stepIndex - currentStepIndex) === 1 ? adjacentTestId : `${HintPanelSelectors.Progress}.${stepIndex}`;

    const handlePress = () => {
        for (let remainingSteps = Math.abs(stepIndex - currentStepIndex); remainingSteps > 0; remainingSteps -= 1) {
            if (stepIndex > currentStepIndex) {
                engine.stepScriptNext();
            } else {
                engine.stepScriptBack();
            }
        }
    };

    return (
        <Pressable
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            onPress={handlePress}
            style={styles.dotControl}
            testID={testId}
        >
            <View style={dotStyles} />
        </Pressable>
    );
};
