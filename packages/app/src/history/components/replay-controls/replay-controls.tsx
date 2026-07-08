import { Trans } from '@lingui/react/macro';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { BlackIconButton } from '../../../@generic/components/black-icon-button/black-icon-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { replayGetStepProgress } from '../../utils/replay-get-step-progress.util';

import { ReplayControlsStyles as styles } from './replay-controls.styles';

import type { EmptyFn } from '@rnw-community/shared';

interface Props {
    readonly currentStep: number;
    readonly totalSteps: number;
    readonly elapsedTime: number;
    readonly onPrevStep: EmptyFn;
    readonly onNextStep: EmptyFn;
}

export const ReplayControls = ({ currentStep, totalSteps, elapsedTime, onPrevStep, onNextStep }: Props) => {
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);

    const canGoBack = isPositiveNumber(currentStep);
    const canGoForward = currentStep < totalSteps;
    const stepProgress = replayGetStepProgress(currentStep, totalSteps);
    const stepProgressPercent: `${number}%` = `${stepProgress * 100}%`;
    const previousIconColor = canGoBack ? theme.colors.label.main : theme.colors.label.hint;
    const nextIconColor = canGoForward ? theme.colors.label.main : theme.colors.label.hint;
    const previousButtonStyles = [
        styles.navButton,
        { backgroundColor: theme.colors.white, borderColor: theme.colors.value.border },
        !canGoBack && styles.disabledButton
    ];
    const nextButtonStyles = [
        styles.navButton,
        { backgroundColor: theme.colors.white, borderColor: theme.colors.value.border },
        !canGoForward && styles.disabledButton
    ];
    const trackStyles = [styles.scrubberTrack, { backgroundColor: theme.colors.value.progress }];
    const fillStyles = [styles.scrubberFill, { backgroundColor: theme.colors.value.progressActive, width: stepProgressPercent }];
    const thumbStyles = [
        styles.scrubberThumb,
        {
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.value.border,
            left: stepProgressPercent
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.metaRow}>
                <BlackText style={styles.metaText}>
                    <Trans>Move</Trans> <Text style={styles.metaValue}>{currentStep}</Text> / {totalSteps}
                </BlackText>
                <BlackText style={styles.metaText}>
                    <Trans>Step time</Trans> <Text style={styles.metaValue}>{elapsedTimeText}</Text>
                </BlackText>
            </View>

            <View style={trackStyles}>
                <View style={fillStyles} />
                <View style={thumbStyles} />
            </View>

            <View style={styles.controlsRow}>
                <BlackIconButton disabled={!canGoBack} isActive onPress={onPrevStep} style={previousButtonStyles}>
                    <LucideChevronLeft color={previousIconColor} size={30} />
                </BlackIconButton>

                <BlackIconButton disabled={!canGoForward} isActive onPress={onNextStep} style={nextButtonStyles}>
                    <LucideChevronRight color={nextIconColor} size={30} />
                </BlackIconButton>
            </View>
        </View>
    );
};
