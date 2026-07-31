import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeTechniqueTierEnum } from '../../enums/challenge-technique-tier.enum';
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
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { awayRanges, techniqueEvents } = summary;

    const sharpCount = techniqueEvents.filter(
        event => event.tier === ChallengeTechniqueTierEnum.Clever || event.tier === ChallengeTechniqueTierEnum.Advanced
    ).length;
    const headlineText =
        sharpCount > 0 ? plural(sharpCount, { one: '# sharp technique', other: '# sharp techniques' }) : t`Solved with the fundamentals`;
    const headlineStyle = [styles.headline, { color: theme.colors.text.primary }];
    const headline = isEmptyArray(techniqueEvents) ? null : (
        <Text allowFontScaling={false} style={headlineStyle}>
            {headlineText}
        </Text>
    );

    return (
        <View style={styles.container} testID={testID}>
            <ChallengeRunTape awayRanges={awayRanges} events={techniqueEvents} label={label} totalTime={totalTime} />

            {headline}

            <ChallengeRunStats summary={summary} />
        </View>
    );
};
