import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import LucideChevronLeft from 'lucide-react-native/icons/chevron-left';
import LucideChevronRight from 'lucide-react-native/icons/chevron-right';
import { View } from 'react-native';

import { i18nIsRightToLeftLocale } from '../../../@generic/utils/i18n-is-right-to-left-locale.util';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

import type { FieldEngine, StepScriptInterface } from '@suuudokuuu/field-core';

interface Props {
    readonly engine: FieldEngine;
    readonly stepIndex: number;
    readonly stepScript: StepScriptInterface;
}

export const HintPanelStepControls = ({ engine, stepIndex, stepScript }: Props) => {
    const { i18n, t } = useLingui();
    const stepCount = stepScript.steps.length;
    const currentStepNumber = stepIndex + 1;
    const isRightToLeft = i18nIsRightToLeftLocale(i18n.locale);
    const previousStepIcon = isRightToLeft ? LucideChevronRight : LucideChevronLeft;
    const nextStepIcon = isRightToLeft ? LucideChevronLeft : LucideChevronRight;

    const handleBack = () => void engine.stepScriptBack();
    const handleNext = () => void engine.stepScriptNext();

    return (
        <View
            accessibilityLabel={t`Step ${currentStepNumber} of ${stepCount}`}
            style={styles.stepControls}
            testID={HintPanelSelectors.Progress}
        >
            <AppButton
                accessibilityLabel={t`Previous step`}
                disabled={currentStepNumber === 1}
                icon={previousStepIcon}
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
                icon={nextStepIcon}
                onPress={handleNext}
                size="compact"
                style={styles.stepButton}
                testID={HintPanelSelectors.NextButton}
                variant="ghost"
            />
        </View>
    );
};
