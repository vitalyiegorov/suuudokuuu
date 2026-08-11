import { use } from 'react';
import { Text, View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistoryRatingBandSegmentStyles as styles } from './history-rating-band-segment.styles';

import type { SeRatingBandInterface } from '../../interfaces/se-rating-band.interface';

const MaxBarHeight = 48;
const ThinTrackHeight = 4;
const MinFilledHeight = 6;

interface Props {
    readonly band: SeRatingBandInterface;
    readonly count: number;
    readonly maxCount: number;
    readonly testID?: string;
}

export const HistoryRatingBandSegment = ({ band, count, maxCount, testID }: Props) => {
    const { theme } = use(ThemeContext);

    const hasCount = isPositiveNumber(count);
    const barHeight = hasCount ? Math.max((count / maxCount) * MaxBarHeight, MinFilledHeight) : ThinTrackHeight;
    const countStyles = [styles.count, { color: theme.colors.text.primary }];
    const barStyles = [styles.bar, { backgroundColor: hasCount ? theme.colors.ink : theme.colors.surface.subtle, height: barHeight }];
    const labelStyles = [styles.label, { color: theme.colors.text.hint }];

    return (
        <View style={styles.segment} testID={testID}>
            <View style={styles.barBlock}>
                {hasCount ? (
                    <Text allowFontScaling={false} style={countStyles}>
                        {count}
                    </Text>
                ) : null}

                <View style={barStyles} />
            </View>

            <BlackText numberOfLines={1} style={labelStyles}>
                {band.label}
            </BlackText>
        </View>
    );
};
