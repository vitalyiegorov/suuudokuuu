import { Plural, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { MetricMinimumFontScaleConstant } from '@suuudokuuu/ui/theme';
import { useRouter } from 'expo-router';
import LucideChevronLeft from 'lucide-react-native/icons/chevron-left';
import LucideChevronRight from 'lucide-react-native/icons/chevron-right';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { getLevelRatingText } from '../../../@generic/utils/get-level-rating-text.util';
import { i18nIsRightToLeftLocale } from '../../../@generic/utils/i18n-is-right-to-left-locale.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryDifficultyChevronSize } from '../../constants/history-difficulty-chevron-size.constant';
import { historyGetWinRate } from '../../utils/history-get-win-rate.util';
import { HistoryDifficultyMeter } from '../history-difficulty-meter/history-difficulty-meter';

import { HistoryDifficultySelectors } from './history-difficulty.selectors';
import { HistoryDifficultyStyles as styles } from './history-difficulty.styles';

import type { DifficultyStatsType } from '@suuudokuuu/progress';

const hardestSolveDifficulties: DifficultyEnum[] = [DifficultyEnum.Hell, DifficultyEnum.Infinity];

interface Props {
    readonly stats: DifficultyStatsType;
}

export const HistoryDifficulty = ({ stats }: Props) => {
    const { theme } = use(ThemeContext);
    const { i18n, t } = useLingui();
    const router = useRouter();
    const { bestRating, difficulty, gamesCompleted, gamesWon, isBestRatingCeiling } = stats;

    const difficultyText = t(getDifficultyMessage(difficulty));
    const canComposeHardestTitle = hardestSolveDifficulties.includes(difficulty) && bestRating > 0;
    const titleText = canComposeHardestTitle ? getLevelRatingText(difficultyText, bestRating, isBestRatingCeiling) : difficultyText;
    const winRate = historyGetWinRate(gamesWon, gamesCompleted);
    const rowStyles = [styles.row, styles.pressableRow];
    const trackFillStyles = [styles.trackFill, { width: `${winRate}%` as const }];
    const DisclosureChevron = i18nIsRightToLeftLocale(i18n.locale) ? LucideChevronLeft : LucideChevronRight;

    const handlePress = () => {
        router.push({ params: { difficulty }, pathname: '/history/[difficulty]' });
    };

    return (
        <Pressable
            accessibilityHint={t`Opens the completed games for this difficulty`}
            accessibilityRole="button"
            onPress={handlePress}
            style={rowStyles}
            testID={`${HistoryDifficultySelectors.Card}.${difficulty}`}
        >
            <HistoryDifficultyMeter difficulty={difficulty} />

            <View style={styles.titleGroup}>
                <BlackText adjustsFontSizeToFit minimumFontScale={MetricMinimumFontScaleConstant} numberOfLines={1} style={styles.title}>
                    {titleText}
                </BlackText>
                <BlackText numberOfLines={1} style={styles.subtitle}>
                    <Plural value={gamesCompleted} one="# game played" other="# games played" />
                </BlackText>
            </View>

            <View style={styles.track}>
                <View style={trackFillStyles} />
            </View>

            <BlackText numberOfLines={1} style={styles.winRate}>
                {`${winRate}%`}
            </BlackText>

            <View style={styles.chevronSlot}>
                <DisclosureChevron color={theme.colors.text.hint} size={HistoryDifficultyChevronSize} />
            </View>
        </Pressable>
    );
};
