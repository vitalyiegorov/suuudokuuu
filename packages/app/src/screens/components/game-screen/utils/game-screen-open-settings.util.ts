import { GameSettingsHref } from '../../../../game/constant/game-settings-href.constant';

export const gameScreenOpenSettings = (pauseGame: () => void, openSettings: (href: typeof GameSettingsHref) => void) => {
    pauseGame();
    openSettings(GameSettingsHref);
};
