import { useLingui } from '@lingui/react/macro';
import { use, useState } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackSubHeader } from '../../../@generic/components/black-sub-header/black-text';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { gameHistoryDifficultySelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { CompletedGamesList } from '../completed-games-list/completed-games-list';

import { HistoryDifficultyStyles as styles } from './history-difficulty.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryDifficulty = ({ difficulty }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const [showGames, setShowGames] = useState(false);
    const {
        bestScore,
        bestTime,
        gamesCompleted,
        gamesWon,
        gamesLost,
        averageTime = 0,
        gamesWonWithoutMistakes = 0,
        hardcoreWon = 0,
        challengesWon = 0,
        challengesLost = 0,
        completedGames = []
    } = useAppSelector(gameHistoryDifficultySelector(difficulty));

    const winRate = gamesWon > 0 ? Math.round((gamesWon / gamesCompleted) * 100) : 0;
    const hasCompletedGames = completedGames.length > 0;

    const hardcoreWonTitleStyles = { color: theme.colors.red };
    const hardcoreWonStyles = [styles.boldText, { color: theme.colors.red }];

    const handleToggleGames = () => {
        setShowGames(!showGames);
    };

    const toggleButtonText = showGames ? t`Hide recent games` : t`Show recent games`;

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
                <Text style={hardcoreWonTitleStyles}>{t`Hardcore won`}:</Text> <Text style={hardcoreWonStyles}>{hardcoreWon}</Text>
            </BlackText>
            <BlackText>
                {t`Challenges won`}: <Text style={styles.boldText}>{challengesWon}</Text>
            </BlackText>
            <BlackText>
                {t`Challenges lost`}: <Text style={styles.boldText}>{challengesLost}</Text>
            </BlackText>

            {hasCompletedGames && (
                <View style={styles.gamesSection}>
                    <BlackButton
                        isActive={showGames}
                        onPress={handleToggleGames}
                        style={styles.showGamesButton}
                        text={toggleButtonText}
                    />
                    {showGames ? <CompletedGamesList difficulty={difficulty} /> : null}
                </View>
            )}
        </View>
    );
};
