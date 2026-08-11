import { describe, expect, it } from '@jest/globals';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';

import { BWLightTheme } from '../../../../theme/themes/bw.theme';
import { parseColor } from '../../../../theme/utils/parse-color.util';

import { ratingBadgeGetColor } from './rating-badge-get-color.util';

const RatingRampMaxRating = 12;

describe('ratingBadgeGetColor', () => {
    it('should render the SE floor rating in the hint token color', () => {
        const color = ratingBadgeGetColor(BWLightTheme, 1);

        expect(parseColor(color)).toEqual(parseColor(BWLightTheme.colors.text.hint));
    });

    it('should render the SE ladder ceiling rating in the accent token color', () => {
        const color = ratingBadgeGetColor(BWLightTheme, SE_RATING_CEILING);

        expect(parseColor(color)).toEqual(parseColor(BWLightTheme.colors.accent));
    });

    it('should render the top of the visible rating scale in the danger token color', () => {
        const color = ratingBadgeGetColor(BWLightTheme, RatingRampMaxRating);

        expect(parseColor(color)).toEqual(parseColor(BWLightTheme.colors.danger));
    });

    it('should clamp ratings below the SE floor to the floor color', () => {
        const color = ratingBadgeGetColor(BWLightTheme, 0);

        expect(parseColor(color)).toEqual(parseColor(BWLightTheme.colors.text.hint));
    });

    it('should clamp ratings above the visible scale to the ceiling color', () => {
        const color = ratingBadgeGetColor(BWLightTheme, 20);

        expect(parseColor(color)).toEqual(parseColor(BWLightTheme.colors.danger));
    });

    it('should blend strictly between the floor and ladder-ceiling tokens below the SE ladder ceiling', () => {
        const hint = parseColor(BWLightTheme.colors.text.hint);
        const accent = parseColor(BWLightTheme.colors.accent);
        const color = parseColor(ratingBadgeGetColor(BWLightTheme, (1 + SE_RATING_CEILING) / 2));

        expect(color?.red).toBeGreaterThanOrEqual(Math.min(hint?.red ?? 0, accent?.red ?? 0));
        expect(color?.red).toBeLessThanOrEqual(Math.max(hint?.red ?? 0, accent?.red ?? 0));
        expect(color?.blue).toBeGreaterThanOrEqual(Math.min(hint?.blue ?? 0, accent?.blue ?? 0));
        expect(color?.blue).toBeLessThanOrEqual(Math.max(hint?.blue ?? 0, accent?.blue ?? 0));
    });

    it('should blend strictly between the ladder-ceiling and danger tokens above the SE ladder ceiling', () => {
        const accent = parseColor(BWLightTheme.colors.accent);
        const danger = parseColor(BWLightTheme.colors.danger);
        const color = parseColor(ratingBadgeGetColor(BWLightTheme, (SE_RATING_CEILING + RatingRampMaxRating) / 2));

        expect(color?.red).toBeGreaterThanOrEqual(Math.min(accent?.red ?? 0, danger?.red ?? 0));
        expect(color?.red).toBeLessThanOrEqual(Math.max(accent?.red ?? 0, danger?.red ?? 0));
        expect(color?.blue).toBeGreaterThanOrEqual(Math.min(accent?.blue ?? 0, danger?.blue ?? 0));
        expect(color?.blue).toBeLessThanOrEqual(Math.max(accent?.blue ?? 0, danger?.blue ?? 0));
    });
});
