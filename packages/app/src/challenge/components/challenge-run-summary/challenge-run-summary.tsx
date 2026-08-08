import { View } from 'react-native';

import { ChallengeRunStats } from '../challenge-run-stats/challenge-run-stats';
import { ChallengeRunTape } from '../challenge-run-tape/challenge-run-tape';

import { ChallengeRunSummarySelectors } from './challenge-run-summary.selectors';
import { ChallengeRunSummaryStyles as styles } from './challenge-run-summary.styles';

import type { ChallengeRunSummaryInterface } from '../../interfaces/challenge-run-summary.interface';

interface Props {
    readonly label: string;
    readonly summary: ChallengeRunSummaryInterface;
    readonly testID?: string;
    readonly totalTime: number;
}

export const ChallengeRunSummary = ({ label, summary, testID = ChallengeRunSummarySelectors.Root, totalTime }: Props) => {
    const { awayRanges, techniqueEvents } = summary;

    return (
        <View style={styles.container} testID={testID}>
            <ChallengeRunTape awayRanges={awayRanges} events={techniqueEvents} label={label} totalTime={totalTime} />

            <ChallengeRunStats summary={summary} />
        </View>
    );
};
