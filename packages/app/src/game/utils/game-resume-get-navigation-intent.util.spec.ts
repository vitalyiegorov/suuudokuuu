import { describe, expect, it } from '@jest/globals';

import { gameResumeGetNavigationIntent } from './game-resume-get-navigation-intent.util';

describe('gameResumeGetNavigationIntent', () => {
    it('keeps the existing game route when resuming from the paused game page', () => {
        expect(gameResumeGetNavigationIntent('/game')).toBe('stay');
    });

    it('replaces standalone pause route with the game route', () => {
        expect(gameResumeGetNavigationIntent('/pause')).toBe('replace');
    });

    it('replaces the current page with the game route from non-game pages', () => {
        expect(gameResumeGetNavigationIntent('/')).toBe('replace');
        expect(gameResumeGetNavigationIntent('/history')).toBe('replace');
    });
});
