import { describe, expect, it, jest } from '@jest/globals';

import { gameScreenMaybeStartWinConfetti } from './game-screen-maybe-start-win-confetti.util';

describe('gameScreenMaybeStartWinConfetti', () => {
    it('starts the confetti for a solo win', () => {
        const startWinConfetti = jest.fn();

        gameScreenMaybeStartWinConfetti(false, false, startWinConfetti);

        expect(startWinConfetti).toHaveBeenCalledTimes(1);
    });

    it('starts the confetti for a won challenge', () => {
        const startWinConfetti = jest.fn();

        gameScreenMaybeStartWinConfetti(true, true, startWinConfetti);

        expect(startWinConfetti).toHaveBeenCalledTimes(1);
    });

    it('skips the confetti when the rival was faster', () => {
        const startWinConfetti = jest.fn();

        gameScreenMaybeStartWinConfetti(true, false, startWinConfetti);

        expect(startWinConfetti).not.toHaveBeenCalled();
    });
});
