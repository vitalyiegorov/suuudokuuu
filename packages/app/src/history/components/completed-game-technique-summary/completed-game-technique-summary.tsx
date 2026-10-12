import * as Effect from 'effect/Effect';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { isNotEmptyArray } from '@rnw-community/shared';

import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { getCompletedGameTechniqueSummary } from '../../utils/get-completed-game-technique-summary.util';
import { HistoryTechniqueChip } from '../history-technique-chip/history-technique-chip';

import { CompletedGameTechniqueSummarySelectors } from './completed-game-technique-summary.selectors';
import { CompletedGameTechniqueSummaryStyles as styles } from './completed-game-technique-summary.styles';

interface Props {
    readonly encodedState: string;
}

export const CompletedGameTechniqueSummary = ({ encodedState }: Props) => {
    const [summary, setSummary] = useState<readonly [string, ReturnType<typeof getCompletedGameTechniqueSummary>]>(['', []]);
    const techniqueUsageList = summary[0] === encodedState ? summary[1] : [];

    useEffect(() => {
        const fiber = appRuntime.runFork(
            Effect.sleep(0).pipe(
                Effect.andThen(() => Effect.sync(() => void setSummary([encodedState, getCompletedGameTechniqueSummary(encodedState)]))),
                Effect.tapCause(logErrorCause)
            )
        );

        return () => void fiber.interruptUnsafe();
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
