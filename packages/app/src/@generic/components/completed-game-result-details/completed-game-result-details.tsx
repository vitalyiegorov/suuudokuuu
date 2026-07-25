import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';

import { UkraineSupportCard } from '../ukraine-support-card/ukraine-support-card';

import { CompletedGameResultDetailsStyles as styles } from './completed-game-result-details.styles';

import type { UkraineSupportCardContext } from '../ukraine-support-card/ukraine-support-card';

interface Props {
    readonly mistakes: number;
    readonly resultContext: UkraineSupportCardContext;
    readonly mistakesTestID: string;
    readonly timeTestID: string;
    readonly timeText: string;
    readonly ukraineSupportTestID: string;
}

export const CompletedGameResultDetails = ({
    mistakes,
    mistakesTestID,
    resultContext,
    timeTestID,
    timeText,
    ukraineSupportTestID
}: Props) => {
    const { t } = useLingui();

    return (
        <>
            <AppMetricStrip style={styles.strip} variant="ghost">
                <AppMetricStripItem label={t`Time`} style={styles.item} testID={timeTestID} value={timeText} />
                <AppMetricStripItem label={t`Mistakes`} style={styles.item} testID={mistakesTestID} value={String(mistakes)} />
            </AppMetricStrip>

            <UkraineSupportCard context={resultContext} testID={ukraineSupportTestID} variant="bordered" />
        </>
    );
};
