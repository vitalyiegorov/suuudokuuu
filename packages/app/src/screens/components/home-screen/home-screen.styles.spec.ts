/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { HomeScreenBottomScrollPadding, HomeScreenTopOverlayHeight, HomeScreenTopOverlayIntensity } from './constant/home-screen.constant';
import { HomeScreenStyles } from './home-screen.styles';

describe('HomeScreenStyles', () => {
    it('should let the home scroll grow naturally instead of stretching its content', () => {
        expect.assertions(4);

        expect(Object.keys(HomeScreenStyles.scrollContent)).not.toContain('flexGrow');
        expect(Object.keys(HomeScreenStyles.scrollContent)).not.toContain('minHeight');
        expect(Object.keys(HomeScreenStyles.scrollContent)).not.toContain('justifyContent');
        expect(Object.keys(HomeScreenStyles.contentStack)).not.toContain('justifyContent');
    });

    it('should stack the home content in one column', () => {
        expect.assertions(1);

        expect(HomeScreenStyles.contentStack.flexDirection).toBe('column');
    });

    it('should keep the header glass compact and visible during scroll bounce', () => {
        expect.assertions(2);

        expect(HomeScreenTopOverlayHeight).toBe(110);
        expect(HomeScreenTopOverlayIntensity).toBe(70);
    });

    it('should reserve the floating tab bar clearance as scroll content inset', () => {
        expect.assertions(2);

        expect(HomeScreenBottomScrollPadding).toBe(32);
        expect(HomeScreenStyles.scrollContent.paddingBottom).toBeLessThan(HomeScreenBottomScrollPadding);
    });
});
