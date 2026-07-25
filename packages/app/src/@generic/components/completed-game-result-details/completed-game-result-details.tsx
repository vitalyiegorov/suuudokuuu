import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';

import { UkraineSupportCard } from '../ukraine-support-card/ukraine-support-card';

import { CompletedGameResultDetailsStyles as styles } from './completed-game-result-details.styles';

import type { AppMetricStripItemInterface } from '@suuudokuuu/ui';

interface Props {
    readonly mistakes: number;
    readonly mistakesTestID: string;
    readonly timeTestID: string;
    readonly timeText: string;
    readonly ukraineSupportTestID: string;
}

export const CompletedGameResultDetails = ({ mistakes, mistakesTestID, timeTestID, timeText, ukraineSupportTestID }: Props) => {
    const { t } = useLingui();

    const metricItems: AppMetricStripItemInterface[] = [
        { label: t`Time`, testID: timeTestID, value: timeText },
        { label: t`Mistakes`, testID: mistakesTestID, value: String(mistakes) }
    ];

    return (
        <>
            <AppMetricStrip itemStyle={styles.item} items={metricItems} style={styles.strip} />

            <UkraineSupportCard testID={ukraineSupportTestID} />
        </>
    );
};
