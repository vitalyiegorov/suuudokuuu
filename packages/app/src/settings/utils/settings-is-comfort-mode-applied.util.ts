import { ComfortModeSettingKeys, ComfortModeSettings } from '../constant/comfort-mode.constant';

import type { SettingsState } from '../store/settings.state';

export const settingsIsComfortModeApplied = (state: SettingsState): boolean =>
    ComfortModeSettingKeys.every(settingKey => state[settingKey] === ComfortModeSettings[settingKey]);
