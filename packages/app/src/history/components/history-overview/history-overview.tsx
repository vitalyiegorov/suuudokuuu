import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { HistoryDifficulty } from '../history-difficulty/history-difficulty';
import { HistoryEmptyState } from '../history-empty-state/history-empty-state';
import { HistoryTotalsCard } from '../history-totals-card/history-totals-card';

import { HistoryOverviewStyles as styles } from './history-overview.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulties: readonly DifficultyEnum[];
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
}

export const HistoryOverview = ({ difficulties, historyByDifficulty }: Props) => {
    const { t } = useLingui();

    if (difficulties.length === 0) {
        return <HistoryEmptyState message={t`Your stats will build as you finish puzzles.`} title={t`No stats yet`} />;
    }

    return (
        <View style={styles.container}>
            <HistoryTotalsCard historyByDifficulty={historyByDifficulty} />

            <View style={styles.difficultySection}>
                {difficulties.map(difficulty => (
                    <HistoryDifficulty difficulty={difficulty} key={difficulty} />
                ))}
            </View>
        </View>
    );
};
