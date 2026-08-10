import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined, isPositiveNumber } from '@rnw-community/shared';

import { seRatingBands } from '../../../history/constants/se-rating-band.constant';
import { getSeRatingBand } from '../../../history/utils/get-se-rating-band.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { BlackText } from '../black-text/black-text';
import { RatingBadge } from '../rating-badge/rating-badge';

import { RatingExplainerSelectors } from './rating-explainer.selectors';
import { RatingExplainerStyles as styles } from './rating-explainer.styles';

import type { HistoryRatingSnapshotInterface } from '../../../history/interfaces/history-rating-snapshot.interface';

const RatingDecimalPlaces = 1;

interface Props {
    readonly rating: number;
    readonly isCeiling: boolean;
    readonly bestRating: HistoryRatingSnapshotInterface;
}

export const RatingExplainer = ({ rating, isCeiling, bestRating }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const currentBand = getSeRatingBand(rating);
    const hasCurrentRating = isPositiveNumber(rating);
    const hasBestRating = isPositiveNumber(bestRating.rating);
    const seRatingCeilingText = SE_RATING_CEILING.toFixed(RatingDecimalPlaces);

    const titleStyles = [styles.title, { color: theme.colors.text.primary }];
    const sectionTitleStyles = [styles.sectionTitle, { color: theme.colors.text.primary }];
    const bodyTextStyles = [styles.bodyText, { color: theme.colors.text.hint }];
    const bandRowStyles = [styles.bandRow, { borderColor: theme.colors.surface.border }];
    const bandNameStyles = [styles.bandName, { color: theme.colors.text.primary }];
    const bandRangeStyles = [styles.bandRange, { color: theme.colors.text.hint }];
    const currentBandNameStyles = [styles.bandName, { color: theme.colors.accent }];

    return (
        <View style={styles.container} testID={RatingExplainerSelectors.Root}>
            <BlackText style={titleStyles}>
                <Trans>The SE difficulty scale</Trans>
            </BlackText>

            <BlackText style={bodyTextStyles}>
                <Trans>
                    Suuudokuuu rates every puzzle on the Sudoku Explainer (SE) scale, the same scale serious solvers use to compare how hard
                    a puzzle actually is to reason through, not just how many clues it has.
                </Trans>
            </BlackText>

            {hasCurrentRating && (
                <View style={styles.currentRatingRow}>
                    <RatingBadge isCeiling={isCeiling} rating={rating} />
                    {isDefined(currentBand) && <BlackText style={bandNameStyles}>{_(currentBand.nameMessage)}</BlackText>}
                </View>
            )}

            {isCeiling && (
                <BlackText style={bodyTextStyles}>
                    <Trans>
                        A “+” means this puzzle is at least SE {seRatingCeilingText}. Beyond that point, puzzles can chain into very long
                        solutions, so we cap the displayed number instead of chasing false precision.
                    </Trans>
                </BlackText>
            )}

            <BlackText style={sectionTitleStyles}>
                <Trans>Bands</Trans>
            </BlackText>

            <View style={styles.bandList}>
                {seRatingBands.map(band => {
                    const isCurrentBand = currentBand?.id === band.id;
                    const rowStyles = [bandRowStyles, isCurrentBand && { borderColor: theme.colors.accent }];
                    const nameStyles = isCurrentBand ? currentBandNameStyles : bandNameStyles;

                    return (
                        <View key={band.id} style={rowStyles}>
                            <BlackText style={nameStyles}>{_(band.nameMessage)}</BlackText>
                            <BlackText style={bandRangeStyles}>{band.label}</BlackText>
                        </View>
                    );
                })}
            </View>

            <BlackText style={sectionTitleStyles}>
                <Trans>Your hardest solve</Trans>
            </BlackText>

            {hasBestRating ? (
                <RatingBadge isCeiling={bestRating.isRatingCeiling} rating={bestRating.rating} />
            ) : (
                <BlackText style={bodyTextStyles}>
                    <Trans>You have not finished a rated puzzle yet.</Trans>
                </BlackText>
            )}
        </View>
    );
};
