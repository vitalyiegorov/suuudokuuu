import { z } from 'zod';

import { isNotEmptyString, isString } from '@rnw-community/shared';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';
import { isCustomThemeId } from '../type-guard/is-custom-theme-id.type-guard';
import { parseColor } from '../utils/parse-color.util';

import type { CustomThemeInterface } from '../interface/custom-theme.interface';
import type { CustomThemeIdType } from '../types/theme-id.type';

export const CustomThemeSchemaVersion = 2;
export const CustomThemeNameMaxLength = 24;

const ColorValueSchema = z.string().refine(value => parseColor(value) !== null);

const ThemeColorsSchema = z.strictObject({
    background: ColorValueSchema,
    ink: ColorValueSchema,
    inkText: ColorValueSchema,
    overlayLight: ColorValueSchema,
    overlayDark: ColorValueSchema,
    danger: ColorValueSchema,
    dangerText: ColorValueSchema,
    accent: ColorValueSchema,
    text: z.strictObject({
        primary: ColorValueSchema,
        hint: ColorValueSchema
    }),
    board: z.strictObject({
        selected: ColorValueSchema,
        selectedText: ColorValueSchema,
        sameValue: ColorValueSchema,
        sameValueText: ColorValueSchema,
        error: ColorValueSchema,
        filled: ColorValueSchema,
        emptyText: ColorValueSchema
    }),
    candidate: z.strictObject({
        text: ColorValueSchema,
        textSelected: ColorValueSchema,
        fill: ColorValueSchema,
        fillSelected: ColorValueSchema,
        borderSelected: ColorValueSchema
    }),
    numpad: z.strictObject({
        track: ColorValueSchema,
        trackFilled: ColorValueSchema,
        trackFilledText: ColorValueSchema,
        text: ColorValueSchema
    }),
    surface: z.strictObject({
        raised: ColorValueSchema,
        raisedText: ColorValueSchema,
        subtle: ColorValueSchema,
        subtleText: ColorValueSchema,
        subtleHint: ColorValueSchema,
        border: ColorValueSchema
    })
});

export const CustomThemeSchema: z.ZodType<CustomThemeInterface> = z.strictObject({
    id: z.custom<CustomThemeIdType>(value => isString(value) && isCustomThemeId(value)),
    name: z
        .string()
        .max(CustomThemeNameMaxLength)
        .refine(value => isNotEmptyString(value.trim())),
    schemaVersion: z.literal(CustomThemeSchemaVersion),
    sourceTheme: z.enum(ThemeEnum),
    colors: z.strictObject({
        [ColorSchemaEnum.Light]: ThemeColorsSchema,
        [ColorSchemaEnum.Dark]: ThemeColorsSchema
    }),
    createdAt: z.number(),
    updatedAt: z.number()
});
