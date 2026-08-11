import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistoryRatingBandSegmentStyles as styles } from './history-rating-band-segment.styles';

import type { SeRatingBandInterface } from '../../interfaces/se-rating-band.interface';

const TrackHeight = 48;
const EmptyFillHeight = 3;
const MinFilledHeight = 6;

interface Props {
    readonly band: SeRatingBandInterface;
    readonly count: number;
    readonly maxCount: number;
    readonly testID?: string;
}

export const HistoryRatingBandSegment = ({ band, count, maxCount, testID }: Props) => {
    const { theme } = use(ThemeContext);

    const hasCount = count > 0;
    const fillHeight = hasCount ? Math.max((count / maxCount) * TrackHeight, MinFilledHeight) : EmptyFillHeight;
    const countStyles = [styles.count, { color: theme.colors.text.primary }];
    const fillStyles = [styles.fill, { backgroundColor: hasCount ? theme.colors.ink : theme.colors.surface.subtle, height: fillHeight }];
    const labelStyles = [styles.label, { color: theme.colors.text.hint }];

    return (
        <View style={styles.segment} testID={testID}>
            <Text allowFontScaling={false} style={countStyles}>
                {hasCount ? String(count) : ''}
            </Text>

            <View style={styles.track}>
                <View style={fillStyles} />
            </View>

            <BlackText numberOfLines={1} style={labelStyles}>
                {band.label}
            </BlackText>
        </View>
    );
};
