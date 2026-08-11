import { useLingui } from '@lingui/react/macro';
import { router } from 'expo-router';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { formatSeRatingValue } from '../../../@generic/utils/format-se-rating-value.util';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getRatingExplainerHref } from '../../../@generic/utils/get-rating-explainer-href.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryMissingValueText } from '../../constants/history-missing-value-text.constant';
import { seRatingBands } from '../../constants/se-rating-band.constant';
import { historyGetRatingBandCounts } from '../../utils/history-get-rating-band-counts.util';
import { HistoryRatingBandSegment } from '../history-rating-band-segment/history-rating-band-segment';

import { HistorySolverProfileSelectors } from './history-solver-profile.selectors';
import { HistorySolverProfileStyles as styles } from './history-solver-profile.styles';

import type { CompletedGameInterface } from '../../interfaces/completed-game.interface';
import type { HistorySeProfileInterface } from '../../interfaces/history-se-profile.interface';

interface Props {
    readonly profile: HistorySeProfileInterface;
    readonly completedGames: readonly CompletedGameInterface[];
}

export const HistorySolverProfile = ({ profile, completedGames }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const hasHardestSolve = profile.hardestSolveRating > 0;
    if (!hasHardestSolve) {
        return null;
    }

    const bandCounts = historyGetRatingBandCounts(completedGames);
    const maxCount = Math.max(...bandCounts.map(entry => entry.count));
    const hardestSolveText = formatSeRatingValue(profile.hardestSolveRating, profile.hardestSolveIsCeiling);
    const hasAverageRecentSe = profile.averageRecentSeRating > 0;
    const averageRecentSeText = hasAverageRecentSe ? formatSeRatingValue(profile.averageRecentSeRating, false) : HistoryMissingValueText;
    const mostPlayedDifficultyText = isDefined(profile.mostPlayedDifficulty)
        ? getDifficultyText(profile.mostPlayedDifficulty)
        : HistoryMissingValueText;
    const subtitleText = t`Avg recent ${averageRecentSeText} · Most played ${mostPlayedDifficultyText}`;

    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];
    const headlineStyles = [styles.headline, { color: theme.colors.text.primary }];
    const subtitleStyles = [styles.subtitle, { color: theme.colors.text.hint }];

    const handlePressHardestSolve = () => {
        router.push(getRatingExplainerHref(profile.hardestSolveRating, profile.hardestSolveIsCeiling));
    };

    return (
        <View style={styles.container} testID={HistorySolverProfileSelectors.Root}>
            <Pressable
                accessibilityRole="button"
                onPress={handlePressHardestSolve}
                style={styles.hero}
                testID={HistorySolverProfileSelectors.HardestSolve}
            >
                <BlackText style={eyebrowStyles}>{t`Hardest solve`}</BlackText>
                <BlackText adjustsFontSizeToFit minimumFontScale={0.62} numberOfLines={1} style={headlineStyles}>
                    {hardestSolveText}
                </BlackText>
                <BlackText numberOfLines={1} style={subtitleStyles}>
                    {subtitleText}
                </BlackText>
            </Pressable>

            <View style={styles.spectrum} testID={HistorySolverProfileSelectors.Spectrum}>
                {seRatingBands.map(band => {
                    const entry = bandCounts.find(bandCount => bandCount.band.id === band.id);

                    return (
                        <HistoryRatingBandSegment
                            band={band}
                            count={entry?.count ?? 0}
                            key={band.id}
                            maxCount={maxCount}
                            testID={`${HistorySolverProfileSelectors.BandSegment}.${band.id}`}
                        />
                    );
                })}
            </View>
        </View>
    );
};
