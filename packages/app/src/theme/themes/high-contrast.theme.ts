import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const HighContrastLightTheme: ThemeInterface = {
    hasErrorOutline: true,
    colors: {
        background: '#ffffff',
        ink: '#000000',
        inkText: '#ffffff',
        overlayLight: 'rgba(0, 0, 0, 0.35)',
        overlayDark: 'rgba(255, 255, 255, 0.6)',
        danger: '#a30000',
        dangerText: '#ffffff',
        accent: '#0033a0',
        text: {
            primary: '#000000',
            hint: '#262626'
        },
        board: {
            selected: '#000000',
            selectedText: '#ffffff',
            sameValue: '#595959',
            sameValueText: '#ffffff',
            error: '#ffbdb8',
            filled: '#e6e6e6',
            emptyText: '#595959'
        },
        candidate: {
            text: '#262626',
            textSelected: '#00214d',
            fill: '#ffffff',
            fillSelected: '#c9dcff',
            borderSelected: '#0033a0'
        },
        numpad: {
            track: '#d1d1d1',
            trackFilled: '#000000',
            trackFilledText: '#ffffff',
            text: '#000000'
        },
        surface: {
            raised: '#ffffff',
            raisedText: '#000000',
            subtle: '#d1d1d1',
            subtleText: '#000000',
            subtleHint: '#262626',
            border: '#000000'
        }
    }
};

export const HighContrastDarkTheme: ThemeInterface = {
    hasErrorOutline: true,
    colors: {
        background: '#000000',
        ink: '#ffffff',
        inkText: '#000000',
        overlayLight: 'rgba(255, 255, 255, 0.35)',
        overlayDark: 'rgba(0, 0, 0, 0.6)',
        danger: '#ff8f8f',
        dangerText: '#000000',
        accent: '#66a3ff',
        text: {
            primary: '#ffffff',
            hint: '#d6d6d6'
        },
        board: {
            selected: '#ffffff',
            selectedText: '#000000',
            sameValue: '#a6a6a6',
            sameValueText: '#000000',
            error: '#6b0f0f',
            filled: '#1f1f1f',
            emptyText: '#a6a6a6'
        },
        candidate: {
            text: '#d6d6d6',
            textSelected: '#e0ecff',
            fill: '#000000',
            fillSelected: '#00306b',
            borderSelected: '#66a3ff'
        },
        numpad: {
            track: '#4d4d4d',
            trackFilled: '#ffffff',
            trackFilledText: '#000000',
            text: '#ffffff'
        },
        surface: {
            raised: '#000000',
            raisedText: '#ffffff',
            subtle: '#333333',
            subtleText: '#ffffff',
            subtleHint: '#d6d6d6',
            border: '#ffffff'
        }
    }
};
