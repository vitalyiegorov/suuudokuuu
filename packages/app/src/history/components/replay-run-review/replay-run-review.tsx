import { View } from 'react-native';

import { HistoryTechniques } from '../history-techniques/history-techniques';
import { ReplayPaceMetrics } from '../replay-pace-metrics/replay-pace-metrics';

import { ReplayRunReviewSelectors } from './replay-run-review.selectors';
import { ReplayRunReviewStyles as styles } from './replay-run-review.styles';

import type { ReplayPaceStatsInterface } from '../../interfaces/replay-pace-stats.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly paceStats: ReplayPaceStatsInterface;
    readonly techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>;
}

export const ReplayRunReview = ({ paceStats, techniqueUsageCounts }: Props) => (
    <View style={styles.container} testID={ReplayRunReviewSelectors.Root}>
        <ReplayPaceMetrics paceStats={paceStats} />

        <HistoryTechniques techniqueUsageCounts={techniqueUsageCounts} />
    </View>
);
