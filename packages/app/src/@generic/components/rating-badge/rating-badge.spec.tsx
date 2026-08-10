import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { I18nTestWrapper } from '../../mocks/i18n-test-wrapper.mock';

import { RatingBadge, RatingBadgeInfinityTierThreshold } from './rating-badge';
import { RatingBadgeSelectors } from './rating-badge.selectors';

const ExactSampleRating = 3.2;
const SeRatingLadderCeiling = 5.4;

let mockReducedMotion = false;

jest.mock('react-native-reanimated', () => {
    const { Text, View } = jest.requireActual<typeof import('react-native')>('react-native');
    const { interpolate, interpolateColor } = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');

    return {
        __esModule: true,
        Easing: { linear: (value: number) => value },
        cancelAnimation: jest.fn(),
        default: { View, Text, createAnimatedComponent: (component: unknown) => component },
        interpolate,
        interpolateColor,
        useAnimatedStyle: (factory: () => object) => factory(),
        useDerivedValue: (factory: () => unknown) => ({ value: factory() }),
        useReducedMotion: () => mockReducedMotion,
        useSharedValue: (initialValue: unknown) => ({ value: initialValue }),
        withRepeat: (animation: unknown) => animation,
        withSpring: (toValue: unknown) => toValue,
        withTiming: (toValue: unknown) => toValue
    };
});

const renderRatingBadge = (rating: number, isCeiling: boolean) =>
    render(<RatingBadge isCeiling={isCeiling} rating={rating} />, { wrapper: I18nTestWrapper });

describe('RatingBadge', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });

    it('should render nothing when the rating is unknown', async () => {
        await renderRatingBadge(0, false);

        expect(screen.queryByTestId(RatingBadgeSelectors.Root)).toBeNull();
    });

    it('should render nothing when the rating is negative', async () => {
        await renderRatingBadge(-1, false);

        expect(screen.queryByTestId(RatingBadgeSelectors.Root)).toBeNull();
    });

    it('should render an exact rating with one decimal place', async () => {
        await renderRatingBadge(ExactSampleRating, false);

        expect(screen.getByTestId(RatingBadgeSelectors.Root)).toBeTruthy();
        expect(screen.getByText('3.2')).toBeTruthy();
    });

    it('should render a ceiling rating with a trailing plus sign', async () => {
        await renderRatingBadge(SeRatingLadderCeiling, true);

        expect(screen.getByText('5.4+')).toBeTruthy();
    });

    it('should still render its content when reduced motion is enabled', async () => {
        mockReducedMotion = true;

        await renderRatingBadge(7, false);

        expect(screen.getByTestId(RatingBadgeSelectors.Root)).toBeTruthy();
        expect(screen.getByText('7.0')).toBeTruthy();
    });

    it('should render the infinity-tier badge with the iridescent treatment at the threshold rating', async () => {
        await renderRatingBadge(RatingBadgeInfinityTierThreshold, true);

        expect(screen.getByTestId(RatingBadgeSelectors.Root)).toBeTruthy();
        expect(screen.getByText('10.0+')).toBeTruthy();
    });

    it('should still render the infinity-tier badge when reduced motion is enabled', async () => {
        mockReducedMotion = true;

        await renderRatingBadge(RatingBadgeInfinityTierThreshold, false);

        expect(screen.getByTestId(RatingBadgeSelectors.Root)).toBeTruthy();
        expect(screen.getByText('10.0')).toBeTruthy();
    });

    it('should not be pressable when no onPress handler is given', async () => {
        await renderRatingBadge(ExactSampleRating, false);

        expect(screen.getByTestId(RatingBadgeSelectors.Root)).toBeTruthy();
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('should invoke the onPress handler when pressed', async () => {
        const onPress = jest.fn();

        await render(<RatingBadge isCeiling={false} onPress={onPress} rating={ExactSampleRating} />, { wrapper: I18nTestWrapper });
        await fireEvent.press(screen.getByRole('button'));

        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
