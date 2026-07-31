import { isString } from '@rnw-community/shared';

import type { ThemeInterface } from '@suuudokuuu/ui/theme';

type ThemeColorsType = ThemeInterface['colors'];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const readColor = (source: Record<string, unknown>, key: string): string | null => {
    const value = source[key];

    return isString(value) ? value : null;
};

const readFamily = (source: Record<string, unknown>, key: string): Record<string, unknown> => {
    const value = source[key];

    return isRecord(value) ? value : {};
};

const migrateTextColors = (label: Record<string, unknown>, fallbackColors: ThemeColorsType): ThemeColorsType['text'] => ({
    primary: readColor(label, 'main') ?? fallbackColors.text.primary,
    hint: readColor(label, 'hint') ?? fallbackColors.text.hint
});

const migrateBoardColors = (cell: Record<string, unknown>, fallbackColors: ThemeColorsType): ThemeColorsType['board'] => ({
    selected: readColor(cell, 'active') ?? fallbackColors.board.selected,
    selectedText: readColor(cell, 'activeText') ?? fallbackColors.board.selectedText,
    sameValue: readColor(cell, 'activeValue') ?? fallbackColors.board.sameValue,
    sameValueText: readColor(cell, 'activeValueText') ?? fallbackColors.board.sameValueText,
    error: readColor(cell, 'error') ?? fallbackColors.board.error,
    filled: readColor(cell, 'filled') ?? fallbackColors.board.filled,
    emptyText: readColor(cell, 'emptyValueText') ?? fallbackColors.board.emptyText
});

const migrateCandidateColors = (candidate: Record<string, unknown>, fallbackColors: ThemeColorsType): ThemeColorsType['candidate'] => ({
    text: readColor(candidate, 'text') ?? fallbackColors.candidate.text,
    textSelected: readColor(candidate, 'textActive') ?? fallbackColors.candidate.textSelected,
    fill: readColor(candidate, 'bg') ?? fallbackColors.candidate.fill,
    fillSelected: readColor(candidate, 'bgActive') ?? fallbackColors.candidate.fillSelected,
    borderSelected: readColor(candidate, 'borderActive') ?? fallbackColors.candidate.borderSelected
});

const migrateNumpadColors = (value: Record<string, unknown>, fallbackColors: ThemeColorsType): ThemeColorsType['numpad'] => ({
    track: readColor(value, 'progress') ?? fallbackColors.numpad.track,
    trackFilled: readColor(value, 'progressActive') ?? fallbackColors.numpad.trackFilled,
    trackFilledText: readColor(value, 'progressActiveText') ?? fallbackColors.numpad.trackFilledText,
    text: readColor(value, 'text') ?? fallbackColors.numpad.text
});

const migrateSurfaceColors = (
    surface: Record<string, unknown>,
    value: Record<string, unknown>,
    fallbackColors: ThemeColorsType
): ThemeColorsType['surface'] => ({
    raised: readColor(surface, 'raised') ?? fallbackColors.surface.raised,
    raisedText: readColor(surface, 'raisedText') ?? fallbackColors.surface.raisedText,
    subtle: readColor(surface, 'subtle') ?? fallbackColors.surface.subtle,
    subtleText: readColor(surface, 'subtleText') ?? fallbackColors.surface.subtleText,
    subtleHint: readColor(surface, 'subtleHint') ?? fallbackColors.surface.subtleHint,
    border: readColor(value, 'border') ?? fallbackColors.surface.border
});

export const migrateCustomThemeColors = (legacyColors: unknown, fallbackColors: ThemeColorsType): ThemeColorsType => {
    const root = isRecord(legacyColors) ? legacyColors : {};
    const label = readFamily(root, 'label');
    const cell = readFamily(root, 'cell');
    const candidate = readFamily(root, 'candidate');
    const value = readFamily(root, 'value');
    const surface = readFamily(root, 'surface');

    return {
        background: readColor(root, 'background') ?? fallbackColors.background,
        ink: readColor(root, 'black') ?? fallbackColors.ink,
        inkText: readColor(label, 'inverted') ?? fallbackColors.inkText,
        overlayLight: readColor(root, 'black05') ?? fallbackColors.overlayLight,
        overlayDark: readColor(root, 'white05') ?? fallbackColors.overlayDark,
        danger: readColor(root, 'red') ?? fallbackColors.danger,
        dangerText: readColor(root, 'redFillText') ?? fallbackColors.dangerText,
        accent: readColor(root, 'blue') ?? fallbackColors.accent,
        text: migrateTextColors(label, fallbackColors),
        board: migrateBoardColors(cell, fallbackColors),
        candidate: migrateCandidateColors(candidate, fallbackColors),
        numpad: migrateNumpadColors(value, fallbackColors),
        surface: migrateSurfaceColors(surface, value, fallbackColors)
    };
};
