import { Themes } from '../constant/themes.constant';

import type { ThemeEnum } from '../enum/theme.enum';

const presetThemeIds: readonly string[] = Themes;

export const isPresetThemeId = (value: string): value is ThemeEnum => presetThemeIds.includes(value);
