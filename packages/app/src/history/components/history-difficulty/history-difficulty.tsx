import { Plural, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { useRouter } from 'expo-router';
import { LucideChevronRight } from 'lucide-react-native';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { getLevelRatingText } from '../../../@generic/utils/get-level-rating-text.util';
import { gameHistoryDifficultySelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryDifficultyChevronSize } from '../../constants/history-difficulty-chevron-size.constant';
import { historyGetWinRate } from '../../utils/history-get-win-rate.util';

import { HistoryDifficultySelectors } from './history-difficulty.selectors';
import { HistoryDifficultyStyles as styles } from './history-difficulty.styles';

const hardestSolveDifficulties: DifficultyEnum[] = [DifficultyEnum.Hell, DifficultyEnum.Infinity];

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryDifficulty = ({ difficulty }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const router = useRouter();
    const { bestRating, gamesCompleted, gamesWon } = useAppSelector(gameHistoryDifficultySelector(difficulty));

    const difficultyText = t(getDifficultyMessage(difficulty));
    const canComposeHardestTitle = hardestSolveDifficulties.includes(difficulty) && bestRating.rating > 0;
    const titleText = canComposeHardestTitle
        ? getLevelRatingText(difficultyText, bestRating.rating, bestRating.isRatingCeiling)
        : difficultyText;
    const winRateText = `${historyGetWinRate(gamesWon, gamesCompleted)}%`;

    const titleStyles = [styles.title, { color: theme.colors.text.primary }];
    const subtitleStyles = [styles.subtitle, { color: theme.colors.text.hint }];
    const winRateStyles = [styles.winRate, { color: theme.colors.text.primary }];

    const handlePress = () => {
        router.push({ params: { difficulty }, pathname: '/history/[difficulty]' });
    };

    return (
        <Pressable
            accessibilityHint={t`Opens the completed games for this difficulty`}
            accessibilityRole="button"
            onPress={handlePress}
            style={styles.row}
            testID={`${HistoryDifficultySelectors.Card}.${difficulty}`}
        >
            <View style={styles.titleGroup}>
                <BlackText style={titleStyles}>{titleText}</BlackText>
                <BlackText style={subtitleStyles}>
                    <Plural value={gamesCompleted} one="# completed game" other="# completed games" />
                </BlackText>
            </View>

            <View style={styles.trailing}>
                <BlackText style={winRateStyles}>{winRateText}</BlackText>
                <LucideChevronRight color={theme.colors.text.hint} size={HistoryDifficultyChevronSize} />
            </View>
        </Pressable>
    );
};
