import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistoryRatingBandRowStyles as styles } from './history-rating-band-row.styles';

import type { SeRatingBandInterface } from '../../interfaces/se-rating-band.interface';

interface Props {
    readonly band: SeRatingBandInterface;
    readonly count: number;
    readonly maxCount: number;
    readonly testID?: string;
}

export const HistoryRatingBandRow = ({ band, count, maxCount, testID }: Props) => {
    const { theme } = use(ThemeContext);

    const fillPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
    const labelStyles = [styles.label, { color: theme.colors.text.primary }];
    const countStyles = [styles.count, { color: theme.colors.text.hint }];
    const trackStyles = [styles.track, { backgroundColor: theme.colors.surface.subtle }];
    const fillStyles = [styles.fill, { backgroundColor: theme.colors.ink, width: `${fillPercent}%` as const }];

    return (
        <View style={styles.row} testID={testID}>
            <BlackText style={labelStyles}>{band.label}</BlackText>

            <View style={trackStyles}>
                <View style={fillStyles} />
            </View>

            <BlackText style={countStyles}>{String(count)}</BlackText>
        </View>
    );
};
