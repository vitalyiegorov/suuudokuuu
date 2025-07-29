import { useLingui } from '@lingui/react/macro';
import { Text, View } from 'react-native';

import { BlackSubHeader } from '../../../@generic/components/black-sub-header/black-text';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { historyDifficultySelector } from '../../store/history.selectors';

import { HistoryDifficultyStyles as styles } from './history-difficulty.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryDifficulty = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const { bestScore, bestTime, gamesCompleted, gamesWon, gamesLost, averageTime, gamesWonWithoutMistakes } = useAppSelector(
        historyDifficultySelector(difficulty)
    );

    const winRate = gamesWon > 0 ? Math.round((gamesWon / gamesCompleted) * 100) : 0;

    return (
        <View style={styles.container}>
            <BlackSubHeader> {getDifficultyText(difficulty)} </BlackSubHeader>

            <BlackText>
                {t`Best score`}: <Text style={styles.boldText}>{bestScore}</Text>
            </BlackText>
            <BlackText>
                {t`Best time`}: <Text style={styles.boldText}>{bestTime}</Text>
            </BlackText>
            <BlackText>
                {t`Average time`}: <Text style={styles.boldText}>{averageTime}</Text>
            </BlackText>
            <BlackText>
                {t`Attempts`}: <Text style={styles.boldText}>{gamesCompleted}</Text>
            </BlackText>
            <BlackText>
                {t`Won`}: <Text style={styles.boldText}>{gamesWon}</Text>
            </BlackText>
            <BlackText>
                {t`Won without mistakes`}: <Text style={styles.boldText}>{gamesWonWithoutMistakes}</Text>
            </BlackText>
            <BlackText>
                {t`Lost`}: <Text style={styles.boldText}>{gamesLost}</Text>
            </BlackText>
            <BlackText>
                {t`Win rate`}: <Text style={styles.boldText}>{winRate}%</Text>
            </BlackText>
        </View>
    );
};
