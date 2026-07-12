import { describe, expect, it, jest } from '@jest/globals';

import { GameSettingsHref } from '../../../../game/constant/game-settings-href.constant';

import { gameScreenOpenSettings } from './game-screen-open-settings.util';

describe('gameScreenOpenSettings', () => {
    it('pauses the active game before opening the gameplay settings route', () => {
        const calls: string[] = [];
        const pauseGame = jest.fn(() => {
            calls.push('pause');
        });
        const openSettings = jest.fn((href: typeof GameSettingsHref) => {
            calls.push(href);
        });

        gameScreenOpenSettings(pauseGame, openSettings);

        expect(calls).toEqual(['pause', GameSettingsHref]);
        expect(openSettings).toHaveBeenCalledWith(GameSettingsHref);
    });
});
