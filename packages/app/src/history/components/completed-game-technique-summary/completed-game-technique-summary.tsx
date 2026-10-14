import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import * as Effect from 'effect/Effect';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { isNotEmptyArray, isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { getCompletedGameTechniqueSummary } from '../../utils/get-completed-game-technique-summary.util';
import { HistoryTechniqueChip } from '../history-technique-chip/history-technique-chip';

import { CompletedGameTechniqueSummarySelectors } from './completed-game-technique-summary.selectors';
import { CompletedGameTechniqueSummaryStyles as styles } from './completed-game-technique-summary.styles';

import type { CompletedGameSummaryInterface } from '../../interfaces/completed-game-summary.interface';

interface Props {
    readonly encodedState: string;
}

const emptySummary: CompletedGameSummaryInterface = { techniqueUsageList: [], hintCount: 0, revealCount: 0 };

export const CompletedGameTechniqueSummary = ({ encodedState }: Props) => {
    const { t } = useLingui();
    const [summary, setSummary] = useState<readonly [string, CompletedGameSummaryInterface]>(['', emptySummary]);
    const { techniqueUsageList, hintCount, revealCount } = summary[0] === encodedState ? summary[1] : emptySummary;

    useEffect(() => {
        const fiber = appRuntime.runFork(
            Effect.sleep(0).pipe(
                Effect.andThen(() => Effect.sync(() => void setSummary([encodedState, getCompletedGameTechniqueSummary(encodedState)]))),
                Effect.tapCause(logErrorCause)
            )
        );

        return () => void fiber.interruptUnsafe();
    }, [encodedState]);

    const hintSummaryText = [
        hintCount > 0 && t({ message: plural(hintCount, { one: '# hint', other: '# hints' }) }),
        revealCount > 0 && t({ message: plural(revealCount, { one: '# reveal', other: '# reveals' }) })
    ]
        .filter(isNotEmptyString)
        .join(' · ');

    return (
        <>
            {isNotEmptyArray(techniqueUsageList) ? (
                <View style={styles.row} testID={CompletedGameTechniqueSummarySelectors.Root}>
                    {techniqueUsageList.map(usage => (
                        <HistoryTechniqueChip
                            key={usage.technique}
                            testID={`${CompletedGameTechniqueSummarySelectors.Root}.Chip.${usage.technique}`}
                            usage={usage}
                        />
                    ))}
                </View>
            ) : null}
            {isNotEmptyString(hintSummaryText) ? (
                <BlackText style={styles.hintSummary} testID={CompletedGameTechniqueSummarySelectors.HintSummary}>
                    {hintSummaryText}
                </BlackText>
            ) : null}
        </>
    );
};
