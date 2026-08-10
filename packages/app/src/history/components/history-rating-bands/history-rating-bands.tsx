import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { historyGetRatingBandCounts } from '../../utils/history-get-rating-band-counts.util';
import { HistoryRatingBandRow } from '../history-rating-band-row/history-rating-band-row';

import { HistoryRatingBandsSelectors } from './history-rating-bands.selectors';
import { HistoryRatingBandsStyles as styles } from './history-rating-bands.styles';

import type { CompletedGameInterface } from '../../interfaces/completed-game.interface';

interface Props {
    readonly completedGames: readonly CompletedGameInterface[];
}

export const HistoryRatingBands = ({ completedGames }: Props) => {
    const { theme } = use(ThemeContext);
    const bandCounts = historyGetRatingBandCounts(completedGames);
    const totalCount = bandCounts.reduce((total, entry) => total + entry.count, 0);

    if (totalCount === 0) {
        return null;
    }

    const maxCount = Math.max(...bandCounts.map(entry => entry.count));
    const containerStyles = [styles.container, { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }];
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];

    return (
        <View style={containerStyles} testID={HistoryRatingBandsSelectors.Root}>
            <BlackText style={titleStyles}>
                <Trans>Solves by SE difficulty</Trans>
            </BlackText>

            <View style={styles.rows}>
                {bandCounts.map(entry => (
                    <HistoryRatingBandRow
                        band={entry.band}
                        count={entry.count}
                        key={entry.band.id}
                        maxCount={maxCount}
                        testID={`${HistoryRatingBandsSelectors.Row}.${entry.band.id}`}
                    />
                ))}
            </View>
        </View>
    );
};
