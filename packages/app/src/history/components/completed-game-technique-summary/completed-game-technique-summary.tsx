import { View } from 'react-native';

import { isNotEmptyArray } from '@rnw-community/shared';

import { getCompletedGameTechniqueSummary } from '../../utils/get-completed-game-technique-summary.util';
import { HistoryTechniqueChip } from '../history-technique-chip/history-technique-chip';

import { CompletedGameTechniqueSummarySelectors } from './completed-game-technique-summary.selectors';
import { CompletedGameTechniqueSummaryStyles as styles } from './completed-game-technique-summary.styles';

interface Props {
    readonly encodedState: string;
}

export const CompletedGameTechniqueSummary = ({ encodedState }: Props) => {
    const techniqueUsageList = getCompletedGameTechniqueSummary(encodedState);

    if (!isNotEmptyArray(techniqueUsageList)) {
        return null;
    }

    return (
        <View style={styles.row} testID={CompletedGameTechniqueSummarySelectors.Root}>
            {techniqueUsageList.map(usage => (
                <HistoryTechniqueChip
                    key={usage.technique}
                    testID={`${CompletedGameTechniqueSummarySelectors.Root}.Chip.${usage.technique}`}
                    usage={usage}
                />
            ))}
        </View>
    );
};
