import { describe, expect, it } from '@jest/globals';

import {
    winConfettiBaseParticleAmountConstant,
    winConfettiMaxParticleAmountConstant,
    winConfettiMinParticleAmountConstant
} from '../constants/win-confetti.constant';

import { getConfettiParticleAmount } from './get-confetti-particle-amount.util';

const referenceWidth = 390;
const referenceHeight = 844;
const tinyWidth = 100;
const tinyHeight = 200;
const hugeWidth = 1440;
const hugeHeight = 2560;
const smallPhoneWidth = 320;
const smallPhoneHeight = 568;

describe('getConfettiParticleAmount', () => {
    it('uses the base amount on the reference viewport', () => {
        expect(getConfettiParticleAmount(referenceWidth, referenceHeight)).toBe(winConfettiBaseParticleAmountConstant);
    });

    it('scales down for smaller viewports', () => {
        const smallPhoneAmount = getConfettiParticleAmount(smallPhoneWidth, smallPhoneHeight);

        expect(smallPhoneAmount).toBeLessThan(winConfettiBaseParticleAmountConstant);
        expect(smallPhoneAmount).toBeGreaterThanOrEqual(winConfettiMinParticleAmountConstant);
    });

    it('never drops below the floor', () => {
        expect(getConfettiParticleAmount(tinyWidth, tinyHeight)).toBe(winConfettiMinParticleAmountConstant);
    });

    it('never grows above the cap', () => {
        expect(getConfettiParticleAmount(hugeWidth, hugeHeight)).toBe(winConfettiMaxParticleAmountConstant);
    });
});
