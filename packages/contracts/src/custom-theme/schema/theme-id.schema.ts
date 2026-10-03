import * as Schema from 'effect/Schema';

export const CustomThemeIdSchema = Schema.TemplateLiteral(['custom-', Schema.String]);

export const PresetThemeIdSchema = Schema.Literals(['black-and-white', 'colorful', 'newspaper', 'high-contrast', 'colorblind-safe']);
