import * as Schema from 'effect/Schema';

import { DifficultySchema } from '../../@generic/schema/difficulty.schema';
import { CustomThemeIdSchema, PresetThemeIdSchema } from '../../custom-theme/schema/theme-id.schema';
import { CellMargin } from '../constant/cell-margin.constant';
import { FontSizes } from '../constant/font-sizes.constant';
import { Languages } from '../constant/languages.constant';
import { MotionPreferences } from '../constant/motion-preferences.constant';

export const SettingsSchema = Schema.Struct({
    hasVibration: Schema.BooleanFromBit,
    hasTimer: Schema.BooleanFromBit,
    showAreas: Schema.BooleanFromBit,
    showIdenticalNumbers: Schema.BooleanFromBit,
    showComboAnimation: Schema.BooleanFromBit,
    showFilledNumbers: Schema.BooleanFromBit,
    showActiveCandidates: Schema.BooleanFromBit,
    keepActiveCell: Schema.BooleanFromBit,
    keepExhaustedDigits: Schema.BooleanFromBit,
    allowHintsOnHardDifficulties: Schema.BooleanFromBit,
    isLeftHanded: Schema.BooleanFromBit,
    calmMode: Schema.BooleanFromBit,
    motionPreference: Schema.Literals(MotionPreferences),
    fontSize: Schema.Literals(FontSizes),
    language: Schema.Literals(Languages),
    theme: Schema.Union([CustomThemeIdSchema, PresetThemeIdSchema]),
    isDarkColorSchema: Schema.BooleanFromBit,
    cellMargin: Schema.Literals(CellMargin),
    lastGameDifficulty: DifficultySchema,
    lastGameMaxMistakes: Schema.Number,
    lastGameChallengeMode: Schema.BooleanFromBit,
    lastStatsDifficulty: DifficultySchema
});
