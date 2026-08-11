import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { isNotEmptyArray } from '@rnw-community/shared';

import { getCompletedGameTechniqueSummary } from '../../utils/get-completed-game-technique-summary.util';
import { HistoryTechniqueChip } from '../history-technique-chip/history-technique-chip';

import { CompletedGameTechniqueSummarySelectors } from './completed-game-technique-summary.selectors';
import { CompletedGameTechniqueSummaryStyles as styles } from './completed-game-technique-summary.styles';

import type { TechniqueUsageInterface } from '../../interfaces/technique-usage.interface';

interface Props {
    readonly encodedState: string;
}

export const CompletedGameTechniqueSummary = ({ encodedState }: Props) => {
    const [techniqueUsageList, setTechniqueUsageList] = useState<readonly TechniqueUsageInterface[]>([]);

    useEffect(() => {
        const timeoutId = setTimeout(() => void setTechniqueUsageList(getCompletedGameTechniqueSummary(encodedState)), 0);

        return () => void clearTimeout(timeoutId);
    }, [encodedState]);

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
