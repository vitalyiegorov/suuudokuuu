import { useLingui } from '@lingui/react/macro';
import { AppMetricCard } from '@suuudokuuu/ui';

import { GameResultMetrics } from '../game-result-metrics/game-result-metrics';
import { UkraineSupportCard } from '../ukraine-support-card/ukraine-support-card';

interface Props {
    readonly mistakes: number;
    readonly mistakesTestID: string;
    readonly timeTestID: string;
    readonly timeText: string;
    readonly ukraineSupportTestID: string;
}

export const CompletedGameResultDetails = ({ mistakes, mistakesTestID, timeTestID, timeText, ukraineSupportTestID }: Props) => {
    const { t } = useLingui();

    return (
        <>
            <GameResultMetrics>
                <AppMetricCard label={t`Time`} testID={timeTestID} value={timeText} />
                <AppMetricCard label={t`Mistakes`} testID={mistakesTestID} value={String(mistakes)} />
            </GameResultMetrics>

            <UkraineSupportCard testID={ukraineSupportTestID} />
        </>
    );
};
