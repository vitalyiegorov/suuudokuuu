import { Trans } from '@lingui/react/macro';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ChallengeAwayBands } from '../../../challenge/components/challenge-away-bands/challenge-away-bands';
import { ThemeContext } from '../../../theme/context/theme.context';
import { replayGetStepProgress } from '../../utils/replay-get-step-progress.util';
import { ReplayTechnique } from '../replay-technique/replay-technique';

import { ReplayControlsSelectors } from './replay-controls.selectors';
import { ReplayControlsStyles as styles } from './replay-controls.styles';

import type { ChallengeAwayRangeInterface } from '../../../challenge/interfaces/challenge-away-range.interface';
import type { EmptyFn } from '@rnw-community/shared';
import type { MoveClassificationInterface } from '@suuudokuuu/techniques';

interface Props {
    readonly awayRanges: ChallengeAwayRangeInterface[];
    readonly currentStep: number;
    readonly totalSteps: number;
    readonly elapsedTime: number;
    readonly moveClassification: MoveClassificationInterface | null;
    readonly onPrevStep: EmptyFn;
    readonly onNextStep: EmptyFn;
}

export const ReplayControls = (props: Props) => {
    const { awayRanges, currentStep, totalSteps, elapsedTime, moveClassification, onPrevStep, onNextStep } = props;

    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);

    const canGoBack = isPositiveNumber(currentStep);
    const canGoForward = currentStep < totalSteps;
    const stepProgress = replayGetStepProgress(currentStep, totalSteps);
    const stepProgressPercent: `${number}%` = `${stepProgress * 100}%`;
    const previousIconColor = canGoBack ? theme.colors.surface.raisedText : theme.colors.text.hint;
    const nextIconColor = canGoForward ? theme.colors.surface.raisedText : theme.colors.text.hint;
    const previousButtonStyles = [styles.navButton, !canGoBack && styles.disabledButton];
    const nextButtonStyles = [styles.navButton, !canGoForward && styles.disabledButton];
    const cardStyles = [styles.card, { backgroundColor: theme.colors.surface.subtle, borderColor: theme.colors.surface.border }];
    const trackStyles = [styles.scrubberTrack, { backgroundColor: theme.colors.numpad.track }];
    const fillStyles = [styles.scrubberFill, { backgroundColor: theme.colors.numpad.trackFilled, width: stepProgressPercent }];
    const thumbStyles = [
        styles.scrubberThumb,
        {
            backgroundColor: theme.colors.numpad.trackFilled,
            borderColor: theme.colors.background,
            left: stepProgressPercent
        }
    ];

    return (
        <View style={styles.container} testID={ReplayControlsSelectors.Root}>
            <View style={cardStyles}>
                <View style={styles.metaRow}>
                    <BlackText style={styles.metaText}>
                        <Trans>Move</Trans> <Text style={styles.metaValue}>{currentStep}</Text> / {totalSteps}
                    </BlackText>
                    <BlackText style={styles.metaText}>
                        <Trans>Step time</Trans> <Text style={styles.metaValue}>{elapsedTimeText}</Text>
                    </BlackText>
                </View>

                <ReplayTechnique classification={moveClassification} />

                <View style={trackStyles}>
                    <View style={fillStyles} />
                    <ChallengeAwayBands ranges={awayRanges} variant="default" />
                    <View style={thumbStyles} />
                </View>
            </View>

            <View style={styles.controlsRow}>
                <AppIconButton
                    disabled={!canGoBack}
                    onPress={onPrevStep}
                    style={previousButtonStyles}
                    testID={ReplayControlsSelectors.PreviousButton}
                    variant="inverted"
                >
                    <LucideChevronLeft color={previousIconColor} size={26} />
                </AppIconButton>

                <AppIconButton
                    disabled={!canGoForward}
                    onPress={onNextStep}
                    style={nextButtonStyles}
                    testID={ReplayControlsSelectors.NextButton}
                    variant="inverted"
                >
                    <LucideChevronRight color={nextIconColor} size={26} />
                </AppIconButton>
            </View>
        </View>
    );
};
