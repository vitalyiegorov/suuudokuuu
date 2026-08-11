import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { I18nTestWrapper } from '../../mocks/i18n-test-wrapper.mock';

import { RatingBadge } from './rating-badge';
import { RatingBadgeSelectors } from './rating-badge.selectors';

const ExactSampleRating = 3.2;
const SeRatingLadderCeiling = 5.4;
const HighInfinityTierRating = 11;

const renderRatingBadge = (rating: number, isCeiling: boolean) =>
    render(<RatingBadge isCeiling={isCeiling} rating={rating} />, { wrapper: I18nTestWrapper });

describe('RatingBadge', () => {
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

    it('should render a high rating with the same static ramp treatment as any other rating', async () => {
        await renderRatingBadge(HighInfinityTierRating, true);

        expect(screen.getByTestId(RatingBadgeSelectors.Root)).toBeTruthy();
        expect(screen.getByText('11.0+')).toBeTruthy();
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
