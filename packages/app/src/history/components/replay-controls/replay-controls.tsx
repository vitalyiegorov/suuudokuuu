import { useLingui } from '@lingui/react/macro';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayControlsStyles as styles } from './replay-controls.styles';

interface Props {
    readonly currentStep: number;
    readonly totalSteps: number;
    readonly elapsedTime: number;
    readonly onPrevStep: () => void;
    readonly onNextStep: () => void;
}

export const ReplayControls = ({ currentStep, totalSteps, elapsedTime, onPrevStep, onNextStep }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const canGoBack = currentStep > 0;
    const canGoForward = currentStep < totalSteps;

    return (
        <View style={styles.container}>
            <View style={styles.timeContainer}>
                <BlackText>
                    {t`Step time`}: <Text style={styles.boldText}>{getTimerText(elapsedTime)}</Text>
                </BlackText>
            </View>
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
