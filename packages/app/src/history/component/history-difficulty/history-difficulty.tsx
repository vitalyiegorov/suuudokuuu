import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackSubHeader } from '../../../@generic/components/black-sub-header/black-text';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { gameHistoryDifficultySelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistoryDifficultyStyles as styles } from './history-difficulty.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryDifficulty = ({ difficulty }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const {
        bestScore,
        bestTime,
        gamesCompleted,
        gamesWon,
        gamesLost,
        averageTime = 0,
        gamesWonWithoutMistakes = 0,
        hardcoreWon = 0
    } = useAppSelector(gameHistoryDifficultySelector(difficulty));

    const winRate = gamesWon > 0 ? Math.round((gamesWon / gamesCompleted) * 100) : 0;

    return (
        <View style={styles.container}>
            <BlackSubHeader> {getDifficultyText(difficulty)} </BlackSubHeader>

            <BlackText>
                {t`Best score`}: <Text style={styles.boldText}>{bestScore}</Text>
            </BlackText>
            <BlackText>
                {t`Best time`}: <Text style={styles.boldText}>{getTimerText(bestTime)}</Text>
            </BlackText>
            <BlackText>
                {t`Average time`}: <Text style={styles.boldText}>{getTimerText(averageTime)}</Text>
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
            <BlackText>
                <Text style={{ color: theme.colors.red }}>{t`Hardcore won`}:</Text>{' '}
                <Text style={[styles.boldText, { color: theme.colors.red }]}>{hardcoreWon}</Text>
            </BlackText>
        </View>
    );
};
