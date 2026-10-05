import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';

import { ColorSchemaEnum } from '../enum/color-schema.enum';

import { CustomThemeIdSchema, PresetThemeIdSchema } from './theme-id.schema';

const LegacyGroupSurfaceColor = 'rgba(128, 128, 128, 0.12)';

export const ThemeColorsSchema = Schema.Struct({
    background: Schema.String,
    ink: Schema.String,
    inkText: Schema.String,
    overlayLight: Schema.String,
    overlayDark: Schema.String,
    danger: Schema.String,
    dangerText: Schema.String,
    accent: Schema.String,
    text: Schema.Struct({ primary: Schema.String, hint: Schema.String }),
    board: Schema.Struct({
        selected: Schema.String,
        selectedText: Schema.String,
        sameValue: Schema.String,
        sameValueText: Schema.String,
        error: Schema.String,
        filled: Schema.String,
        emptyText: Schema.String
    }),
    candidate: Schema.Struct({
        text: Schema.String,
        textSelected: Schema.String,
        fill: Schema.String,
        fillSelected: Schema.String,
        borderSelected: Schema.String
    }),
    numpad: Schema.Struct({ track: Schema.String, trackFilled: Schema.String, trackFilledText: Schema.String, text: Schema.String }),
    surface: Schema.Struct({
        raised: Schema.String,
        raisedText: Schema.String,
        subtle: Schema.String,
        subtleText: Schema.String,
        subtleHint: Schema.String,
        group: Schema.String.pipe(Schema.withDecodingDefaultKey(Effect.succeed(LegacyGroupSurfaceColor))),
        border: Schema.String
    })
});

export const CustomThemeSchema = Schema.Struct({
    id: CustomThemeIdSchema,
    name: Schema.String,
    schemaVersion: Schema.Number,
    sourceTheme: PresetThemeIdSchema,
    colors: Schema.fromJsonString(Schema.Struct({ [ColorSchemaEnum.Light]: ThemeColorsSchema, [ColorSchemaEnum.Dark]: ThemeColorsSchema })),
    createdAt: Schema.Number,
    updatedAt: Schema.Number
});
