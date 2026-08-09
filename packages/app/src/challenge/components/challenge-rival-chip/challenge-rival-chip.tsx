import { use } from 'react';
import { Text, View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { RatingBadge } from '../../../@generic/components/rating-badge/rating-badge';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeRivalChipStyles as styles } from './challenge-rival-chip.styles';

const RivalInitial = 'R';

interface Props {
    readonly chipText: string;
    readonly isRatingCeiling: boolean;
    readonly rating: number;
}

export const ChallengeRivalChip = ({ chipText, isRatingCeiling, rating }: Props) => {
    const { theme } = use(ThemeContext);
    const hasRating = isPositiveNumber(rating);
    const chipStyle = [styles.chip, { backgroundColor: theme.colors.ink }];
    const chipAvatarStyle = [styles.chipAvatar, { backgroundColor: theme.colors.overlayDark }];
    const chipAvatarTextStyle = [styles.chipAvatarText, { color: theme.colors.inkText }];
    const chipTextStyle = [styles.chipText, { color: theme.colors.inkText }];

    return (
        <View style={chipStyle}>
            <View style={chipAvatarStyle}>
                <Text allowFontScaling={false} style={chipAvatarTextStyle}>
                    {RivalInitial}
                </Text>
            </View>
            <Text allowFontScaling={false} numberOfLines={1} style={chipTextStyle}>
                {chipText}
            </Text>

            {hasRating && <RatingBadge isCeiling={isRatingCeiling} rating={rating} />}
        </View>
    );
};
