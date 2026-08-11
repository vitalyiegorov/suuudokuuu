import { useLingui } from '@lingui/react/macro';
import { Pressable, Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { isDefined, isPositiveNumber } from '@rnw-community/shared';

import { BlackTextStyles } from '../black-text/black-text.styles';

import { RatingBadgeSelectors } from './rating-badge.selectors';
import { RatingBadgeStyles as styles } from './rating-badge.styles';
import { ratingBadgeGetColor } from './utils/rating-badge-get-color.util';

const RatingDecimalPlaces = 1;
const RatingCeilingSuffix = '+';

interface Props {
    readonly isCeiling: boolean;
    readonly rating: number;
    readonly onPress?: () => void;
}

export const RatingBadge = ({ isCeiling, rating, onPress }: Props) => {
    const { theme } = useUnistyles();
    const { t } = useLingui();

    if (!isPositiveNumber(rating)) {
        return null;
    }

    const ratingLabel = `${rating.toFixed(RatingDecimalPlaces)}${isCeiling ? RatingCeilingSuffix : ''}`;
    const rampColor = ratingBadgeGetColor(theme, rating);
    const pillStyles = [styles.pill, { backgroundColor: theme.colors.surface.subtle, borderColor: rampColor }];
    const valueStyles = [BlackTextStyles.text, { color: theme.colors.text.primary }, styles.value, { color: rampColor }];

    const badge = (
        <View style={pillStyles} testID={RatingBadgeSelectors.Root}>
            <Text accessibilityLabel={t`Difficulty rating ${ratingLabel}`} allowFontScaling={false} style={valueStyles}>
                {ratingLabel}
            </Text>
        </View>
    );

    if (!isDefined(onPress)) {
        return badge;
    }

    return (
        <Pressable accessibilityRole="button" onPress={onPress}>
            {badge}
        </Pressable>
    );
};
