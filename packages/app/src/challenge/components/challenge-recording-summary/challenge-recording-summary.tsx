import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { getChallengeRecordingSummary } from '../../utils/get-challenge-recording-summary.util';
import { ChallengeRecordingStats } from '../challenge-recording-stats/challenge-recording-stats';
import { ChallengeRunTape } from '../challenge-run-tape/challenge-run-tape';
import { ChallengeTechniqueBreakdown } from '../challenge-technique-breakdown/challenge-technique-breakdown';

import { ChallengeRecordingSummarySelectors } from './challenge-recording-summary.selectors';
import { ChallengeRecordingSummaryStyles as styles } from './challenge-recording-summary.styles';

import type { GameTimelineEventInterface } from '../../../game/interface/game-timeline-event.interface';

interface Props {
    readonly elapsedTime: number;
    readonly timelineEvents: GameTimelineEventInterface[];
}

export const ChallengeRecordingSummary = ({ elapsedTime, timelineEvents }: Props) => {
    const { t } = useLingui();

    const { awayRanges, awaySeconds, exitCount, pencilCount, techniqueEvents } = getChallengeRecordingSummary(timelineEvents, elapsedTime);

    return (
        <View style={styles.container} testID={ChallengeRecordingSummarySelectors.Root}>
            <ChallengeRunTape awayRanges={awayRanges} events={techniqueEvents} label={t`Your recording`} totalTime={elapsedTime} />

            <ChallengeRecordingStats awaySeconds={awaySeconds} exitCount={exitCount} pencilCount={pencilCount} />

            <ChallengeTechniqueBreakdown events={techniqueEvents} label={t`Your playbook`} />
        </View>
    );
};
