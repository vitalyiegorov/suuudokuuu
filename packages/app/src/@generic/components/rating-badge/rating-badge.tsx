import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
    cancelAnimation,
    interpolate,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { isDefined, isPositiveNumber } from '@rnw-community/shared';

import { useIridescentColor } from '../../hooks/use-iridescent-color.hook';
import { BlackTextStyles } from '../black-text/black-text.styles';

import { RatingBadgeSelectors } from './rating-badge.selectors';
import { RatingBadgeStyles as styles } from './rating-badge.styles';
import { ratingBadgeGetColor } from './utils/rating-badge-get-color.util';

const RatingBadgeSpringDamping = 12;
const RatingBadgeSpringStiffness = 160;
const RatingBadgeAppearFromScale = 0.6;
const RatingDecimalPlaces = 1;
const RatingCeilingSuffix = '+';
export const RatingBadgeInfinityTierThreshold = 10;

interface Props {
    readonly isCeiling: boolean;
    readonly rating: number;
    readonly onPress?: () => void;
}

export const RatingBadge = ({ isCeiling, rating, onPress }: Props) => {
    const { theme } = useUnistyles();
    const { t } = useLingui();
    const reduceMotion = useReducedMotion();
    const appear = useSharedValue(0);
    const isInfinityTier = rating >= RatingBadgeInfinityTierThreshold;
    const iridescentColor = useIridescentColor(theme, isInfinityTier);

    useEffect(() => {
        if (!reduceMotion) {
            appear.value = withSpring(1, { damping: RatingBadgeSpringDamping, stiffness: RatingBadgeSpringStiffness });
        }

        return () => void cancelAnimation(appear);
    }, [reduceMotion, appear]);

    const appearAnimatedStyle = useAnimatedStyle(() => ({
        opacity: appear.value,
        transform: [{ scale: interpolate(appear.value, [0, 1], [RatingBadgeAppearFromScale, 1]) }]
    }));
    const iridescentBorderAnimatedStyle = useAnimatedStyle(() => ({ borderColor: iridescentColor.value }));
    const iridescentTextAnimatedStyle = useAnimatedStyle(() => ({ color: iridescentColor.value }));

    if (!isPositiveNumber(rating)) {
        return null;
    }

    const ratingLabel = `${rating.toFixed(RatingDecimalPlaces)}${isCeiling ? RatingCeilingSuffix : ''}`;
    const rampColor = ratingBadgeGetColor(theme, rating);
    const pillStyles = [
        resolveUnistyleForAnimated(styles.pill),
        { backgroundColor: theme.colors.surface.subtle, borderColor: rampColor },
        ...(reduceMotion ? [] : [appearAnimatedStyle]),
        ...(isInfinityTier ? [iridescentBorderAnimatedStyle] : [])
    ];
    const valueStyles = [
        resolveUnistyleForAnimated(BlackTextStyles.text),
        { color: theme.colors.text.primary },
        resolveUnistyleForAnimated(styles.value),
        { color: rampColor },
        ...(isInfinityTier ? [iridescentTextAnimatedStyle] : [])
    ];

    const badge = (
        <Animated.View style={pillStyles} testID={RatingBadgeSelectors.Root}>
            <Animated.Text accessibilityLabel={t`Difficulty rating ${ratingLabel}`} allowFontScaling={false} style={valueStyles}>
                {ratingLabel}
            </Animated.Text>
        </Animated.View>
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
