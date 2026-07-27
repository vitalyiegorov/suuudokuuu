import { use } from 'react';
import { View } from 'react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeAwayBandsSelectors } from './challenge-away-bands.selectors';
import { ChallengeAwayBandsStyles as styles } from './challenge-away-bands.styles';

import type { ChallengeAwayRangeInterface } from '../../interfaces/challenge-away-range.interface';

const BandOpacity = 0.22;
const MinimumBandPercent = 1.2;

interface Props {
    readonly ranges: ChallengeAwayRangeInterface[];
    readonly variant: 'default' | 'inverted';
}

export const ChallengeAwayBands = ({ ranges, variant }: Props) => {
    const { theme } = use(ThemeContext);

    if (isEmptyArray(ranges)) {
        return null;
    }

    const bandColor = variant === 'inverted' ? theme.colors.label.inverted : theme.colors.label.main;

    return (
        <View pointerEvents="none" style={styles.container} testID={ChallengeAwayBandsSelectors.Root}>
            {ranges.map(range => {
                const widthPercent = Math.max(MinimumBandPercent, range.endPercent - range.startPercent);
                const bandStyle = [
                    styles.band,
                    {
                        backgroundColor: bandColor,
                        left: `${range.startPercent}%` as const,
                        opacity: BandOpacity,
                        width: `${widthPercent}%` as const
                    }
                ];
                const bandKey = `away-band-${range.startPercent}-${range.endPercent}`;

                return <View key={bandKey} style={bandStyle} />;
            })}
        </View>
    );
};
