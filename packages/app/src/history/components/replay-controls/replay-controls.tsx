import { useLingui } from '@lingui/react/macro';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ReplayTechnique } from '../replay-technique/replay-technique';

import { ReplayControlsStyles as styles } from './replay-controls.styles';

import type { EmptyFn } from '@rnw-community/shared';
import type { TechniqueResultInterface } from '@suuudokuuu/generator';

interface Props {
    readonly currentStep: number;
    readonly totalSteps: number;
    readonly elapsedTime: number;
    readonly techniqueResult: TechniqueResultInterface | null;
    readonly onPrevStep: EmptyFn;
    readonly onNextStep: EmptyFn;
}

export const ReplayControls = ({ currentStep, totalSteps, elapsedTime, techniqueResult, onPrevStep, onNextStep }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const canGoBack = isPositiveNumber(currentStep);
    const canGoForward = currentStep < totalSteps;

    return (
        <View style={styles.container}>
            <View style={styles.timeContainer}>
                <BlackText>
                    {t`Step time`}: <Text style={styles.boldText}>{getTimerText(elapsedTime)}</Text>
                </BlackText>
            </View>
            <ReplayTechnique result={techniqueResult} />
            <View style={styles.controlsRow}>
                {canGoBack ? (
                    <BlackButton onPress={onPrevStep} style={styles.navButton}>
                        <LucideChevronLeft color={theme.colors.label.inverted} size={28} />
                    </BlackButton>
                ) : (
                    <View style={styles.navButtonPlaceholder} />
                )}
                <View style={styles.stepCounterContainer}>
                    <BlackText style={styles.stepCounter}>
                        <Text style={styles.boldText}>{currentStep}</Text> / {totalSteps}
                    </BlackText>
                    <BlackText style={styles.stepLabel}>{t`moves`}</BlackText>
                </View>
                {canGoForward ? (
                    <BlackButton onPress={onNextStep} style={styles.navButton}>
                        <LucideChevronRight color={theme.colors.label.inverted} size={28} />
                    </BlackButton>
                ) : (
                    <View style={styles.navButtonPlaceholder} />
                )}
            </View>
        </View>
    );
};
