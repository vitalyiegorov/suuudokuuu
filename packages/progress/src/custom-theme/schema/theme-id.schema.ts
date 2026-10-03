import * as Schema from 'effect/Schema';

import { ThemeEnum } from '../enum/theme.enum';

export const CustomThemeIdSchema = Schema.TemplateLiteral(['custom-', Schema.String]);

export const PresetThemeIdSchema = Schema.Enum(ThemeEnum);
