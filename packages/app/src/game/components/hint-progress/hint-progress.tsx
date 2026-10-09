import { Text, View } from 'react-native';

import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

import type { StepScriptInterface } from '@suuudokuuu/field-core';

const maxProgressDots = 9;

interface Props {
    readonly progressLabel: string;
    readonly stepIndex: number;
    readonly stepScript: StepScriptInterface;
}

export const HintProgress = ({ progressLabel, stepIndex, stepScript }: Props) => {
    if (stepScript.steps.length > maxProgressDots) {
        return <Text style={styles.progressText}>{progressLabel}</Text>;
    }

    return (
        <View style={styles.dots}>
            {stepScript.steps.map((step, index) => {
                const isCurrentStep = index === stepIndex;
                const dotStyles = isCurrentStep ? styles.dotActive : styles.dot;

                return <View key={`${step.kind}-${index}`} style={dotStyles} />;
            })}
        </View>
    );
};
