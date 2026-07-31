import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../themes/bw.theme';

import { migrateCustomThemeColors } from './migrate-custom-theme-colors.util';

const legacyColors = {
    background: '#111111',
    white: '#eeeeee',
    white05: 'rgba(255, 255, 255, 0.05)',
    black: '#222222',
    black05: 'rgba(0, 0, 0, 0.05)',
    red: '#330000',
    redFillText: '#443333',
    blue: '#000055',
    label: {
        main: '#616161',
        inverted: '#626262',
        hint: '#636363'
    },
    candidate: {
        border: '#717171',
        borderActive: '#727272',
        text: '#737373',
        textActive: '#747474',
        bg: '#757575',
        bgActive: '#767676'
    },
    cell: {
        active: '#818181',
        activeText: '#828282',
        highlighted: '#838383',
        highlightedText: '#848484',
        activeValue: '#858585',
        activeValueText: '#868686',
        error: '#878787',
        emptyValueText: '#888888',
        filled: '#898989'
    },
    value: {
        border: '#919191',
        progress: '#929292',
        progressActive: '#939393',
        progressActiveText: '#949494',
        text: '#959595'
    },
    surface: {
        raised: '#a1a1a1',
        raisedText: '#a2a2a2',
        subtle: '#a3a3a3',
        subtleText: '#a4a4a4',
        subtleHint: '#a5a5a5'
    }
};

describe('migrateCustomThemeColors', () => {
    it('maps every legacy token onto the semantic vocabulary', () => {
        expect(migrateCustomThemeColors(legacyColors, BWLightTheme.colors)).toStrictEqual({
            background: '#111111',
            ink: '#222222',
            inkText: '#626262',
            overlayLight: 'rgba(0, 0, 0, 0.05)',
            overlayDark: 'rgba(255, 255, 255, 0.05)',
            danger: '#330000',
            dangerText: '#443333',
            accent: '#000055',
            text: { primary: '#616161', hint: '#636363' },
            board: {
                selected: '#818181',
                selectedText: '#828282',
                sameValue: '#858585',
                sameValueText: '#868686',
                error: '#878787',
                filled: '#898989',
                emptyText: '#888888'
            },
            candidate: {
                text: '#737373',
                textSelected: '#747474',
                fill: '#757575',
                fillSelected: '#767676',
                borderSelected: '#727272'
            },
            numpad: {
                track: '#929292',
                trackFilled: '#939393',
                trackFilledText: '#949494',
                text: '#959595'
            },
            surface: {
                raised: '#a1a1a1',
                raisedText: '#a2a2a2',
                subtle: '#a3a3a3',
                subtleText: '#a4a4a4',
                subtleHint: '#a5a5a5',
                border: '#919191'
            }
        });
    });

    it('drops the merged duplicate tokens in favor of their absorbing tokens', () => {
        const migrated = migrateCustomThemeColors(legacyColors, BWLightTheme.colors);

        expect(migrated.surface.raised).not.toBe(legacyColors.white);
        expect(migrated.surface.subtle).not.toBe(legacyColors.cell.highlighted);
        expect(migrated.surface.subtleText).not.toBe(legacyColors.cell.highlightedText);
        expect(migrated.surface.border).not.toBe(legacyColors.candidate.border);
    });

    it('falls back to the provided colors for missing or invalid legacy fields', () => {
        const partialLegacyColors = {
            background: '#111111',
            label: { main: 42 }
        };
        const migrated = migrateCustomThemeColors(partialLegacyColors, BWLightTheme.colors);

        expect(migrated.background).toBe('#111111');
        expect(migrated.text.primary).toBe(BWLightTheme.colors.text.primary);
        expect(migrated.ink).toBe(BWLightTheme.colors.ink);
        expect(migrated.board).toStrictEqual(BWLightTheme.colors.board);
    });

    it('returns the fallback colors for a fully corrupt payload', () => {
        expect(migrateCustomThemeColors(undefined, BWLightTheme.colors)).toStrictEqual(BWLightTheme.colors);
        expect(migrateCustomThemeColors('broken', BWLightTheme.colors)).toStrictEqual(BWLightTheme.colors);
    });
});
