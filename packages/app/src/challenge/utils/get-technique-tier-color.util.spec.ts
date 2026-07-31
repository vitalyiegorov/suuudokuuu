import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../../theme/themes/bw.theme';
import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getTechniqueTierColor } from './get-technique-tier-color.util';

const theme = BWLightTheme;

describe('getTechniqueTierColor', () => {
    describe('on the default surface', () => {
        it.each([
            [ChallengeTechniqueTierEnum.Guess, theme.colors.danger],
            [ChallengeTechniqueTierEnum.Advanced, theme.colors.accent],
            [ChallengeTechniqueTierEnum.Clever, theme.colors.text.primary],
            [ChallengeTechniqueTierEnum.Basic, theme.colors.text.hint]
        ])('should colour the %s tier', (tier, expected) => {
            expect.assertions(1);

            expect(getTechniqueTierColor(tier, theme)).toBe(expected);
        });
    });

    describe('on the inverted surface', () => {
        it.each([
            [ChallengeTechniqueTierEnum.Guess, theme.colors.danger],
            [ChallengeTechniqueTierEnum.Advanced, theme.colors.accent],
            [ChallengeTechniqueTierEnum.Clever, theme.colors.inkText],
            [ChallengeTechniqueTierEnum.Basic, theme.colors.overlayDark]
        ])('should colour the %s tier', (tier, expected) => {
            expect.assertions(1);

            expect(getTechniqueTierColor(tier, theme, 'inverted')).toBe(expected);
        });
    });

    it('should treat an explicit default surface the same as an omitted one', () => {
        expect.assertions(1);

        expect(getTechniqueTierColor(ChallengeTechniqueTierEnum.Clever, theme, 'default')).toBe(
            getTechniqueTierColor(ChallengeTechniqueTierEnum.Clever, theme)
        );
    });

    it('should only vary guess and advanced colours independently of the surface', () => {
        expect.assertions(2);

        expect(getTechniqueTierColor(ChallengeTechniqueTierEnum.Guess, theme, 'inverted')).toBe(
            getTechniqueTierColor(ChallengeTechniqueTierEnum.Guess, theme)
        );
        expect(getTechniqueTierColor(ChallengeTechniqueTierEnum.Advanced, theme, 'inverted')).toBe(
            getTechniqueTierColor(ChallengeTechniqueTierEnum.Advanced, theme)
        );
    });
});
