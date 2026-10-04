import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../../@generic/hooks/use-timer-text.hook';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ReplayScrubber } from '../../replay-scrubber/replay-scrubber';
import { ReplayTechnique } from '../../replay-technique/replay-technique';
import { ReplayControlsStyles as styles } from '../replay-controls.styles';

import type { ChallengeAwayRangeInterface } from '../../../../challenge/interfaces/challenge-away-range.interface';
import type { MoveClassificationInterface } from '@suuudokuuu/techniques';

interface Props {
    readonly awayRanges: ChallengeAwayRangeInterface[];
    readonly currentStep: number;
    readonly elapsedTime: number;
    readonly moveClassification: MoveClassificationInterface | null;
    readonly onScrubStep: (step: number) => void;
    readonly totalSteps: number;
}

export const ReplayStepCard = ({ awayRanges, currentStep, elapsedTime, moveClassification, onScrubStep, totalSteps }: Props) => {
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);
    const cardStyles = [styles.card, { backgroundColor: theme.colors.surface.subtle, borderColor: theme.colors.surface.border }];

    return (
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

            <ReplayScrubber awayRanges={awayRanges} currentStep={currentStep} onScrubStep={onScrubStep} totalSteps={totalSteps} />
        </View>
    );
};
