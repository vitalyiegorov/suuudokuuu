import type { ComfortModeSettingKeys } from '../constant/comfort-mode.constant';
import type { SettingsState } from '../store/settings.state';

export type ComfortModeRestoreType = Pick<SettingsState, (typeof ComfortModeSettingKeys)[number] | 'lastGameMaxMistakes'>;
