import { describe, expect, it } from '@jest/globals';

import { ChallengeLossReason } from '../../../../challenge/enums/challenge-loss-reason.enum';

import { gameScreenGetLostRoute, gameScreenGetWonRoute } from './game-screen-get-result-route.util';

describe('gameScreenGetLostRoute', () => {
    it('should send a solo run to the loser screen', () => {
        expect.assertions(1);

        expect(gameScreenGetLostRoute(false)).toBe('/loser');
    });

    it('should blame mistakes when a rival run runs out of them', () => {
        expect.assertions(1);

        expect(gameScreenGetLostRoute(true)).toStrictEqual({
            pathname: '/challenge-lost',
            params: { reason: ChallengeLossReason.Mistakes }
        });
    });
});

describe('gameScreenGetWonRoute', () => {
    it('should send a solo win to the winner screen', () => {
        expect.assertions(1);

        expect(gameScreenGetWonRoute(false, false)).toBe('/winner');
    });

    it('should send a beaten rival to the challenge won screen', () => {
        expect.assertions(1);

        expect(gameScreenGetWonRoute(true, true)).toBe('/challenge-won');
    });

    it('should blame time when the rival finished first', () => {
        expect.assertions(1);

        expect(gameScreenGetWonRoute(true, false)).toStrictEqual({
            pathname: '/challenge-lost',
            params: { reason: ChallengeLossReason.Time }
        });
    });
});
