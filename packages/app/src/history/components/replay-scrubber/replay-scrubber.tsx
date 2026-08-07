import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { ChallengeAwayBands } from '../../../challenge/components/challenge-away-bands/challenge-away-bands';
import { ThemeContext } from '../../../theme/context/theme.context';
import { replayGetStepProgress } from '../../utils/replay-get-step-progress.util';

import { useReplayScrubberGesture } from './hooks/use-replay-scrubber-gesture.hook';
import { ReplayScrubberSelectors } from './replay-scrubber.selectors';
import { ReplayScrubberStyles as styles } from './replay-scrubber.styles';

import type { ChallengeAwayRangeInterface } from '../../../challenge/interfaces/challenge-away-range.interface';
import type { AccessibilityActionEvent } from 'react-native';

interface Props {
    readonly awayRanges: ChallengeAwayRangeInterface[];
    readonly currentStep: number;
    readonly onScrubStep: (step: number) => void;
    readonly totalSteps: number;
}

export const ReplayScrubber = ({ awayRanges, currentStep, onScrubStep, totalSteps }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { handleRailLayout, scrubberGesture } = useReplayScrubberGesture({ onScrubStep, totalSteps });

    const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
        if (event.nativeEvent.actionName === 'increment') {
            onScrubStep(Math.min(currentStep + 1, totalSteps));
        }

        if (event.nativeEvent.actionName === 'decrement') {
            onScrubStep(Math.max(currentStep - 1, 0));
        }
    };

    const stepProgress = replayGetStepProgress(currentStep, totalSteps);
    const stepProgressPercent: `${number}%` = `${stepProgress * 100}%`;
    const trackStyles = [styles.track, { backgroundColor: theme.colors.numpad.track }];
    const fillStyles = [styles.fill, { backgroundColor: theme.colors.numpad.trackFilled, width: stepProgressPercent }];
    const thumbStyles = [
        styles.thumb,
        { backgroundColor: theme.colors.numpad.trackFilled, borderColor: theme.colors.background, left: stepProgressPercent }
    ];
    const accessibilityActions = [{ name: 'increment' }, { name: 'decrement' }];
    const accessibilityValue = { max: totalSteps, min: 0, now: currentStep };

    return (
        <GestureDetector gesture={scrubberGesture}>
            <View
                accessibilityActions={accessibilityActions}
                accessibilityLabel={t`Replay progress`}
                accessibilityRole="adjustable"
                accessibilityValue={accessibilityValue}
                accessible
                onAccessibilityAction={handleAccessibilityAction}
                onLayout={handleRailLayout}
                style={styles.hitArea}
                testID={ReplayScrubberSelectors.Root}
            >
                <View style={trackStyles}>
                    <View style={fillStyles} />
                    <ChallengeAwayBands ranges={awayRanges} variant="default" />
                    <View style={thumbStyles} />
                </View>
            </View>
        </GestureDetector>
    );
};
