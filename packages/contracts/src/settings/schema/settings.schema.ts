import * as Schema from 'effect/Schema';

import { DifficultySchema } from '../../@generic/schema/difficulty.schema';
import { CustomThemeIdSchema, PresetThemeIdSchema } from '../../custom-theme/schema/theme-id.schema';

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
    motionPreference: Schema.Literals(['system', 'full', 'reduced']),
    fontSize: Schema.Literals(['xs', 's', 'm', 'xl']),
    language: Schema.Literals(['en', 'de', 'uk', 'es', 'fr', 'sv', 'zh', 'hi', 'ar', 'bn', 'pt', 'id', 'ur']),
    theme: Schema.Union([CustomThemeIdSchema, PresetThemeIdSchema]),
    isDarkColorSchema: Schema.BooleanFromBit,
    cellMargin: Schema.Literals([0, 2, 5]),
    lastGameDifficulty: DifficultySchema,
    lastGameMaxMistakes: Schema.Number,
    lastGameChallengeMode: Schema.BooleanFromBit,
    lastStatsDifficulty: DifficultySchema
});
