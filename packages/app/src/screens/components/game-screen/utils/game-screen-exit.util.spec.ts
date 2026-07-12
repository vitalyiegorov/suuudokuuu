import { describe, expect, it, jest } from '@jest/globals';

import { gameScreenExit } from './game-screen-exit.util';

describe('gameScreenExit', () => {
    it('resets the game and dismisses to home', () => {
        const calls: string[] = [];
        const resetGame = jest.fn(() => {
            calls.push('reset');
        });
        const dismissToHome = jest.fn((href: '/') => {
            calls.push(href);
        });

        gameScreenExit(resetGame, dismissToHome);

        expect(calls).toEqual(['reset', '/']);
        expect(dismissToHome).toHaveBeenCalledWith('/');
    });
});
