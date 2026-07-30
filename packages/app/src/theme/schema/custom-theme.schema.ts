import { z } from 'zod';

import { isString } from '@rnw-community/shared';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { isCustomThemeId } from '../type-guard/is-custom-theme-id.type-guard';
import { parseColor } from '../utils/parse-color.util';

import type { CustomThemeInterface } from '../interface/custom-theme.interface';
import type { CustomThemeIdType } from '../types/theme-id.type';

export const CustomThemeSchemaVersion = 1;
export const CustomThemeNameMaxLength = 24;

const ColorValueSchema = z.string().refine(value => parseColor(value) !== null);

const ThemeColorsSchema = z.strictObject({
    background: ColorValueSchema,
    white: ColorValueSchema,
    white05: ColorValueSchema,
    black: ColorValueSchema,
    black05: ColorValueSchema,
    red: ColorValueSchema,
    redFillText: ColorValueSchema,
    blue: ColorValueSchema,
    label: z.strictObject({
        main: ColorValueSchema,
        inverted: ColorValueSchema,
        hint: ColorValueSchema
    }),
    candidate: z.strictObject({
        border: ColorValueSchema,
        borderActive: ColorValueSchema,
        text: ColorValueSchema,
        textActive: ColorValueSchema,
        bg: ColorValueSchema,
        bgActive: ColorValueSchema
    }),
    cell: z.strictObject({
        active: ColorValueSchema,
        activeText: ColorValueSchema,
        highlighted: ColorValueSchema,
        highlightedText: ColorValueSchema,
        activeValue: ColorValueSchema,
        activeValueText: ColorValueSchema,
        error: ColorValueSchema,
        emptyValueText: ColorValueSchema,
        filled: ColorValueSchema
    }),
    value: z.strictObject({
        border: ColorValueSchema,
        progress: ColorValueSchema,
        progressActive: ColorValueSchema,
        progressActiveText: ColorValueSchema,
        text: ColorValueSchema
    }),
    surface: z.strictObject({
        raised: ColorValueSchema,
        raisedText: ColorValueSchema,
        subtle: ColorValueSchema,
        subtleText: ColorValueSchema,
        subtleHint: ColorValueSchema
    })
});

export const CustomThemeSchema: z.ZodType<CustomThemeInterface> = z.strictObject({
    id: z.custom<CustomThemeIdType>(value => isString(value) && isCustomThemeId(value)),
    name: z
        .string()
        .max(CustomThemeNameMaxLength)
        .refine(value => value.trim().length > 0),
    schemaVersion: z.literal(CustomThemeSchemaVersion),
    sourceTheme: z.enum(ThemeEnum),
    colors: z.strictObject({
        [ColorSchemaEnum.Light]: ThemeColorsSchema,
        [ColorSchemaEnum.Dark]: ThemeColorsSchema
    }),
    createdAt: z.number(),
    updatedAt: z.number()
});
