import type { CustomThemeIdType } from '../types/theme-id.type';

export const isCustomThemeId = (value: string): value is CustomThemeIdType => value.startsWith('custom-');
