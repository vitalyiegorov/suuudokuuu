import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { LucideDoorOpen, LucidePencil } from 'lucide-react-native';
import { View } from 'react-native';

import { ChallengeStatChip } from '../challenge-stat-chip/challenge-stat-chip';

import { ChallengeRecordingStatsSelectors } from './challenge-recording-stats.selectors';
import { ChallengeRecordingStatsStyles as styles } from './challenge-recording-stats.styles';

interface Props {
    readonly awaySeconds: number;
    readonly exitCount: number;
    readonly pencilCount: number;
}

export const ChallengeRecordingStats = ({ awaySeconds, exitCount, pencilCount }: Props) => {
    const { t } = useLingui();

    const hasExits = exitCount > 0;
    const exitsText = plural(exitCount, { one: '# exit', other: '# exits' });
    const awayText = t`${awaySeconds}s away`;
    const pencilText = plural(pencilCount, { one: '# pencil action', other: '# pencil actions' });
    const exitsChip = hasExits ? (
        <ChallengeStatChip icon={LucideDoorOpen} testID={ChallengeRecordingStatsSelectors.ExitsValue} text={`${exitsText} · ${awayText}`} />
    ) : null;

    return (
        <View style={styles.row} testID={ChallengeRecordingStatsSelectors.Root}>
            {exitsChip}

            <ChallengeStatChip icon={LucidePencil} testID={ChallengeRecordingStatsSelectors.PencilValue} text={pencilText} />
        </View>
    );
};
